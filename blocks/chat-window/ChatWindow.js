'use strict';

/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showProfile } from '../../actions/modals';
import {
    hideEmoji,
    addAttachments,
    hideInputPopup } from '../../actions/activeChat';

import Chat from '../../models/Chat';

import Input from './input-form/Input';
import Message from './message/Message';
import Preview from './preview-panel/Preview';

import './ChatWindow.css';

class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggable: false
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideEmoji();
                this.props.hideInputPopup();
            }
        });
    }

    // обработка переносимого файла
    toggleDragOver = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    // управление отображением области дропа
    toggleDragEnter = e => {
        e.preventDefault();
        this.setState({ isDraggable: true });
    };

    toggleDragLeave = e => {
        e.preventDefault();
        this.setState({ isDraggable: false });
    };

    // обработка дропа
    toggleDrop = e => {
        e.preventDefault();
        const { files } = e.dataTransfer;

        this.setState({ isDraggable: false });
        this.props.addAttachments(files);
    };

    showProfile = profile => {
        this.props.showProfile(profile);
    };

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView();
        }
    };

    activeChatId = '0';
    messagesCount = 0;
    componentDidUpdate() {
        const { activeChat } = this.props;

        if (!activeChat) {
            return;
        }

        if (activeChat._id !== this.activeChatId) {
            this.scrollToBottom();
            this.activeChatId = activeChat._id;
            this.messagesCount = activeChat.messages.length;
        } else if (activeChat.messages.length !== this.messagesCount) {
            this.scrollToBottom();
            this.messagesCount = activeChat.messages.length;
        }
    }

    render() {
        const { activeChat, user, attachments } = this.props;

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
            <section
                className="chat-window"
                onDragOver={this.toggleDragOver}
                onDragEnter={this.toggleDragEnter}
                onDragLeave={this.toggleDragLeave}
                onDrop={this.toggleDrop}
                >
                <div className="chat-header" onClick={this.props.hideEmoji}>
                    <img
                        className="chat-header__img"
                        alt="chatavatar"
                        src={`${avatar}`}
                        title="Посмотреть информацию"
                        onClick={() => this.showProfile(activeChat)}
                    />
                    <span
                        className="chat-header__name"
                        title="Посмотреть информацию"
                        onClick={() => this.showProfile(activeChat)}
                        >
                        {title}
                    </span>
                </div>
                {this.state.isDraggable
                    ?
                        <div className="chat-window__dragndrop-hint">
                            Перетащите ваши файлы сюда
                        </div>
                    :
                    (
                        <div
                            className={'messages messages_grid_' +
                            `${attachments.length ? 'small' : 'large'}`}
                            onClick={this.props.hideEmoji}>
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
                    )
                }
                <Preview />
                <Input activeChat={this.props.activeChat} />
            </section>
        );
    }
}

ChatWindow.propTypes = {
    user: PropTypes.object,
    activeChat: PropTypes.object,

    showProfile: PropTypes.func,
    attachments: PropTypes.array,
    addAttachments: PropTypes.func,
    hideInputPopup: PropTypes.func,
    hideEmoji: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        activeChat: state.chats.find(c => state.activeChat && c._id === state.activeChat.id),
        attachments: state.activeChat && state.activeChat.attachments
    }), {
        showProfile,
        addAttachments,
        hideInputPopup,
        hideEmoji
    }
)(ChatWindow);
