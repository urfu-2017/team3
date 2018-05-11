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
    showEmoji,
    hideEmoji,
    resetAttachments,
    sendMessage,
    showInputPopup,
    hideInputPopup } from '../../actions/activeChat';

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
            msgText: ''
        };
    }

    // при вводе добавляем с state
    changeText = e => this.setState({ msgText: e.target.value });

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideEmoji();
                this.props.hideInputPopup();
            }
        });
    }

    // клик на рожицу, используется в <Emoji.../>
    toggleEmoji = () => {
        if (this.props.emojiActive) {
            this.props.hideEmoji();
        } else {
            this.props.showEmoji();
        }
    }

    // функция добавления emoji
    addEmoji = emoji => {
        const input = document.querySelector('.chat-input__write-field');
        let currentValue = input.value;

        currentValue += `${emoji.colons}`;
        this.setState({ msgText: currentValue });
        this.textInput.focus();
        // input.value = currentValue;
    }

    /* eslint-disable max-statements */
    submitMessage = () => {
        const { attachments } = this.props;

        if (this.state.msgText.trim() || attachments.length) {
            this.props.resetAttachments();
            this.setState({
                msgText: ''
            });
            this.props.hideEmoji();
            const input = document.querySelector('.chat-input__write-field');
            const text = input.value;

            input.value = '';

            const message = {
                text,
                author: this.props.user.nickname,
                attachments: this.props.attachments.map(a => a.url)
            };
            const chatId = this.props.activeChat._id;

            this.props.sendMessage(chatId, message);
        }
    }

    // прослушка отправки на Enter
    keySubmitMessage = e => {
        if (e.keyCode === 13) {
            this.submitMessage();
        }
    }

    showProfile = profile => {
        this.props.showProfile(profile);
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView();
        }
    }

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
            <section className="chat-window">
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
                <div
                    className={`messages messages_grid_${attachments.length ? 'small' : 'large'}`}
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
                <Emoji addEmoji={this.addEmoji} />
                <Preview />
                <div className="chat-input" onClick={this.props.hideEmoji}>
                    <input
                        onChange={this.changeText}
                        onKeyDown={this.keySubmitMessage}
                        type="text"
                        ref={input => { this.textInput = input; }}
                        autoFocus
                        className="chat-input__write-field"
                        value={this.state.msgText}
                    />
                    <label
                        className="chat-input__audioinput-btn chat-input__button"
                        title="Набор голосом"
                        >
                    </label>
                    <label
                        className="chat-input__emoji-btn chat-input__button"
                        onClick={event => event.stopPropagation()}
                        title="Добавить emoji"
                        >
                        <input
                            type="button"
                            onClick={this.toggleEmoji}
                            className="chat-input__input_not-visual"
                        />
                    </label>
                    <label
                        className="chat-input__burger-btn chat-input__button"
                        onClick={this.props.showInputPopup}
                        title="Прикрепить"
                        >
                    </label>
                    <label
                        src="/static/send_message.svg"
                        onClick={this.submitMessage}
                        className="chat-input__send-btn chat-input__button"
                        title="Отправить сообщение"
                    />
                </div>
                <InputPopup />
            </section>
        );
    }
}

ChatWindow.propTypes = {
    user: PropTypes.object,
    emojiActive: PropTypes.bool,
    showProfile: PropTypes.func,
    showEmoji: PropTypes.func,
    hideEmoji: PropTypes.func,
    activeChat: PropTypes.object,
    attachments: PropTypes.array,
    resetAttachments: PropTypes.func,
    showInputPopup: PropTypes.func,
    hideInputPopup: PropTypes.func,
    sendMessage: PropTypes.func
};

export default connect(
    state => ({
        activeChat: state.chats.find(c => state.activeChat && c._id === state.activeChat.id),
        user: state.user,
        emojiActive: state.activeChat && state.activeChat.showEmoji,
        attachments: state.activeChat && state.activeChat.attachments,
        showInputPopup: state.activeChat && state.activeChat.showInputPopup
    }), {
        showProfile,
        showEmoji,
        hideEmoji,
        sendMessage,
        resetAttachments,
        showInputPopup,
        hideInputPopup
    }
)(ChatWindow);
