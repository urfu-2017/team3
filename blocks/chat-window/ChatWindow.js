'use strict';

/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getSocket from '../../pages/socket';

import Chat from '../../models/Chat';

import InputPopup from './input-form/popup-additional-functions/InputPopup';
import Message from './message/Message';
import Emoji from './input-form/Emoji';
import Preview from './preview-panel/Preview';

import './ChatWindow.css';

class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgText: '',
            foundUsersList: false
        };
    }

    // при вводе добавляем с state
    changeText = e => this.setState({ msgText: e.target.value });

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

    /* eslint-disable max-statements */
    submitMessage = async () => {
        const attachments = this.props.attachments || [];

        if (this.state.msgText.trim() || attachments.length) {
            this.props.resetAttachments();
            this.setState({
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
                    attachments: this.props.attachmentsLinks || []
                },
                chatId: this.props.activeChat._id
            }, async data => {
                await this.props.onReceiveMessage(data);
                await this.scrollToBottom();
            });

            this.props.onSortChats(this.props.activeChat._id);
        }
    }

    // при подгрузке картинок меняем css
    togglePreview(oldfiles) {
        const messages = document.querySelector('.messages');

        messages.classList.remove(
            'messages_grid_large',
            'messages_grid_small'
        );

        if (oldfiles.length) {
            messages.classList.add('messages_grid_small');
        } else {
            messages.classList.add('messages_grid_large');
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
                <Preview togglePreview={this.togglePreview} />
                <div className="chat-input" onClick={this.props.onHideEmoji}>
                    <input
                        onChange={this.changeText}
                        onKeyDown={this.keySubmitMessage}
                        type="text"
                        className="chat-input__write-field"
                    />
                    <label
                        className="chat-input__audioinput-btn chat-input__button"
                        >
                    </label>
                    <label
                        className="chat-input__emoji-btn chat-input__button"
                        onClick={event => event.stopPropagation()}
                        >
                        <input
                            type="button"
                            onClick={this.toggleEmoji}
                            className="chat-input__input_not-visual"
                        />
                    </label>
                    <label
                        className="chat-input__burger-btn chat-input__button"
                        onClick={this.props.onShowInputPopup}
                        >
                    </label>
                    <label
                        src="/static/send_message.svg"
                        onClick={this.submitMessage}
                        className="chat-input__send-btn chat-input__button"
                    />
                </div>
                <InputPopup
                    togglePreview={this.togglePreview}
                />
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
    onSortChats: PropTypes.func,
    attachments: PropTypes.array,
    attachmentsLinks: PropTypes.array,
    resetAttachments: PropTypes.func,
    onShowInputPopup: PropTypes.func
};

export default connect(
    state => ({
        activeChat: state.chats.find(c => state.activeChat && c._id === state.activeChat.id),
        user: state.user,
        showEmoji: state.activeChat && state.activeChat.showEmoji,
        attachments: state.activeChat && state.activeChat.attachments,
        attachmentsLinks: state.activeChat && state.activeChat.attachmentsLinks,
        showInputPopup: state.activeChat && state.activeChat.showInputPopup
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
        },
        resetAttachments: () => {
            dispatch({ type: 'RESET_ATTACHMENTS' });
        },
        onShowInputPopup: () => {
            dispatch({ type: 'SHOW_INPUT_POPUP' });
        }
    })
)(ChatWindow);
