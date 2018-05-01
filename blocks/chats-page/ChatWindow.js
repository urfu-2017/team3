'use strict';

/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

// import fetch from 'node-fetch';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from '../common-components/Message';

import Emoji from './Emoji';

import Preview from './Preview';

import './ChatWindow.css';

// const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            chats: null,
            showProfile: this.props.showProfile,
            messages: [],
            msgText: '',
            openChat: this.props.openChat,
            foundUsersList: false,
            showEmoji: false
        };
    }

    // добавляем сообщения в список при клике на чат
    getMessages = async () => {
        // console.log('llok', this.props, this.state);
        const response = await fetch(`/api/chats/5ae717583575fc2688d32744/messages`, {
            credentials: 'include',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const messages = await response.json();

        this.setState({ messages });
    }

    // при вводе добавляем с state
    changeText = e => this.setState({ msgText: e.target.value });

    // при подгрузке картинок меняем css
    togglePreview(newFiles, oldfiles) {
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
    onFilesChange = e => {
        const attachments = this.state.attachments || [];

        const { currentTarget: { files } } = e;

        [...files].forEach(file => {
            attachments.push(file);
        });

        this.setState({ attachments });
        this.togglePreview([...files], attachments);
    }

    // клик на рожицу, используется в <Emoji.../>
    showEmoji = () => {
        const showEmoji = !this.state.showEmoji;

        this.setState({ showEmoji });
    }

    // отправка сообщения
    submitMessage = async () => {
        await fetch(`/api/chats/${this.props.openChat.id}/messages`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: this.state.msgText })
        });
        document.querySelector('.chat-input__write-field').value = '';

        // if (response.status === 200 || response.status === 201) {
        //     /* eslint prefer-const: 0*/
        //     const createdMessage = await response.json();

        //     let messagesNow = this.state.messages;

        //     messagesNow.push(createdMessage);
        //     // this.props.changeLastMessage(this.state.id, this.state.msgText);
        //     this.setState({ messages: messagesNow, msgText: '' });
        // }
    };

    // прослушка отправки на Enter
    keySubmitMessage = e => {
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            this.submitMessage();
        }
    }

    render() {
        const { showProfile, openChat } = this.props;
        const { user, messages, msgText } = this.state;

        if (openChat === null) {
            return (
                <section className="chat-window">
                    <img src="/static/main-label-bw.svg" className="chat-window__stub" />
                </section>
            );
        }
        this.getMessages();

        return (
            <section className="chat-window">
                <div className="chat-header">
                    <img
                        className="chat-header__img"
                        alt="chatavatar"
                        src={`data:image/svg+xml;base64,${openChat.avatar}`}
                        onClick={() => showProfile(openChat)}
                    />
                    <span
                        className="chat-header__name"
                        onClick={() => showProfile(openChat)}
                        >
                        {openChat.title}
                    </span>
                </div>
                <div className="messages messages_grid_large">
                    {}
                    {messages.map(message => (
                        <Message
                            key={message.id}
                            message={message}
                            user={user}
                            title={openChat.title}
                        />
                    ))}
                </div>
                <Emoji showEmoji={this.state.showEmoji} />
                <Preview files={this.state.attachments} />
                <div className="chat-input chat-input_separator_box-shadow">
                    <input
                        value={msgText}
                        onChange={this.changeText}
                        onKeyDown={this.keySubmitMessage}
                        type="text"
                        className="chat-input__write-field"
                    />
                    <label className="chat-input__emoji-btn chat-input__button">
                        <input
                            type="button"
                            onClick={this.showEmoji}
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
    openChat: PropTypes.object,
    showProfile: PropTypes.func
};
