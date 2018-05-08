'use strict';

/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getSocket from '../../pages/socket';

import Message from '../common-components/Message';

import Chat from '../../models/Chat';

import Emoji from './Emoji';
import Preview from './Preview';

import './ChatWindow.css';

class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgText: '',
            foundUsersList: false,
            attachments: []
        };
    }

    // при вводе добавляем с state
    changeText = e => this.setState({ msgText: e.target.value });

    // при подгрузке картинок меняем css
    togglePreview(oldfiles) {
        const messages = document.querySelector('.messages');
        const chatInput = document.querySelector('.chat-input');

        messages.classList.remove(
            'messages_grid_large',
            'messages_grid_small'
        );
        chatInput.classList.remove(
            'chat-input_separator_box-shadow',
            'chat-input_separator_border'
        );

        if (oldfiles.length) {
            messages.classList.add('messages_grid_small');
            chatInput.classList.add('chat-input_separator_border');
        } else {
            messages.classList.add('messages_grid_large');
            chatInput.classList.add('chat-input_separator_box-shadow');
        }
    }

    // добавляем новые файлы в превью
    onFilesChange = async e => {
        const attachments = this.state.attachments || [];

        const { currentTarget: { files } } = e;

        const links = [];

        await Promise.all([...files].map(async file => {
            const formData = new FormData();

            formData.append('image', file);
            const response = await fetch('/api/attachments', {
                credentials: 'include',
                method: 'PUT',
                body: formData
            });

            if (response.status === 200) {
                const answer = await response.json();
                const { url } = answer;

                links.push(url);

                return url;
            }

            return 'http://fotki.ykt.ru/albums/userpics/15649/moeya.jpg';
        }));

        if (attachments.length) {
            await this.setState({
                attachmentsLinks: this.state.attachmentsLinks.concat(links)
            });
        } else {
            await this.setState({
                attachmentsLinks: links
            });
        }
        [...files].forEach(file => {
            attachments.push(file);
        });
        await this.setState({ attachments });
        await this.togglePreview(attachments);
    }

    // клик на рожицу, используется в <Emoji.../>
    toggleEmoji = () => {
        if (this.props.showEmoji) {
            this.props.onHideEmoji();
        } else {
            this.props.onShowEmoji();
        }
    }

    // функция добавления emoji
    addEmoji = emoji => {
        const input = document.querySelector('.chat-input__write-field');
        let currentValue = input.value;

        currentValue += `${emoji.colons}`;
        input.value = currentValue;
    }

    submitMessage = async () => {
        if (this.state.msgText.trim() || this.state.attachments.length) {
            this.setState({
                attachments: [],
                attachmentsLinks: [],
                msgText: ''
            });
            this.togglePreview([]);
            const input = document.querySelector('.chat-input__write-field');
            const text = input.value;

            input.value = '';
            const socket = getSocket();

            await socket.emit('message', {
                message: {
                    text,
                    author: this.props.user.nickname,
                    attachments: this.state.attachmentsLinks || []
                },
                chatId: this.props.activeChat._id
            }, async data => {
                await this.props.onReceiveMessage(data);
                await this.scrollToBottom();
            });

            setTimeout(() => {
                this.props.onSortChats(this.props.activeChat._id);
            }, 500);
        }
    }

    // прослушка отправки на Enter
    keySubmitMessage = e => {
        if (e.keyCode === 13) {
            this.submitMessage();
            e.target.value = '';
        }
    }

    showProfile = profile => {
        this.props.onShowProfile(profile);
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView();
        }
    }

    activeChatId = '0';

    componentDidUpdate() {
        const { activeChat } = this.props;

        if (!activeChat) {
            return;
        }

        if (activeChat._id !== this.activeChatId) {
            this.scrollToBottom();
            this.activeChatId = activeChat._id;
            this.messagesCount = activeChat.messages.length;
        }
    }

    render() {
        const { activeChat, user } = this.props;

        if (!activeChat) {
            return (
                <section className="chat-window">
                    <img src="/static/main-label-bw.svg" className="chat-window__stub" />
                </section>
            );
        }

        const chat = new Chat(activeChat);
        const avatar = chat.getAvatarFor(user);
        const title = chat.getTitleFor(user);

        return (
            <section className="chat-window">
                <div className="chat-header" onClick={this.props.onHideEmoji}>
                    <img
                        className="chat-header__img"
                        alt="chatavatar"
                        src={`${avatar}`}
                        onClick={() => this.showProfile(activeChat)}
                    />
                    <span
                        className="chat-header__name"
                        onClick={() => this.showProfile(activeChat)}
                        >
                        {title}
                    </span>
                </div>
                <div className="messages messages_grid_large" onClick={this.props.onHideEmoji}>
                    {activeChat.messages.map(message => (
                        <Message
                            key={message._id || '0'}
                            message={message}
                            user={user}
                            activeChat={activeChat}
                            showEmojiToMsg={false}
                        />
                    ))}
                    <div ref={el => { this.messagesEnd = el; }}></div>
                </div>
                <Emoji addEmoji={this.addEmoji} />
                <Preview files={this.state.attachments} />
                <div
                    className="chat-input chat-input_separator_box-shadow"
                    onClick={this.props.onHideEmoji}>
                    <input
                        onChange={this.changeText}
                        onKeyDown={this.keySubmitMessage}
                        type="text"
                        className="chat-input__write-field"
                    />
                    <label
                        className="chat-input__emoji-btn chat-input__button"
                        onClick={event => event.stopPropagation()}>
                        <input
                            type="button"
                            onClick={this.toggleEmoji}
                            className="chat-input__not-visual"
                        />
                        <img
                            src="/static/emoji.svg"
                            className="chat-input__emoji-icon"
                        />
                    </label>
                    <label className="chat-input__attachment-btn chat-input__button">
                        <input
                            type="file"
                            className="chat-input__not-visual"
                            multiple
                            onChange={this.onFilesChange}
                        />
                        <img
                            src="/static/camera.svg"
                            className="chat-input__attachment-icon"
                        />
                    </label>
                    <div
                        onClick={this.submitMessage}
                        className="chat-input__send-btn chat-input__button"
                    />
                </div>
            </section>
        );
    }
}

ChatWindow.propTypes = {
    user: PropTypes.object,
    onShowProfile: PropTypes.func,
    onShowEmoji: PropTypes.func,
    onHideEmoji: PropTypes.func,
    onReceiveMessage: PropTypes.func,
    showEmoji: PropTypes.bool,
    activeChat: PropTypes.object,
    onSortChats: PropTypes.func
};

export default connect(
    state => ({
        activeChat: state.chats.find(c => state.activeChat && c._id === state.activeChat.id),
        user: state.user,
        showEmoji: state.activeChat && state.activeChat.showEmoji
    }),
    dispatch => ({
        onShowProfile: profile => {
            dispatch({ type: 'SHOW_PROFILE', profile });
        },
        onShowEmoji: () => {
            dispatch({ type: 'SHOW_EMOJI' });
        },
        onHideEmoji: () => {
            dispatch({ type: 'HIDE_EMOJI' });
        },
        onReceiveMessage: ({ chatId, message }) => {
            dispatch({ type: 'RECEIVE_MESSAGE', chatId, message });
        },
        onSortChats: id => {
            dispatch({ type: 'SORT_CHATS', id });
        }
    })
)(ChatWindow);
