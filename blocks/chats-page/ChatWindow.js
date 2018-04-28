'use strict';

/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

// import fetch from 'node-fetch';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from '../common-components/Message';

import Preview from './Preview';

import './ChatWindow.css';

// const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class ChatWindow extends Component {
    state = { user: null, openChat: null, messages: [], msgText: '' };

    changeText = e => this.setState({ msgText: e.target.value });

    componentWillReceiveProps({ user, openChat }) {
        // const response = await fetch(`/api/chats/${openChat.id}/messages`);
        // const messages = await response.json();
        const messages = [
            {
                id: '2302123',
                author: '14900963',
                date: '2232132123',
                text: 'Привет! Сегодня встречаемся?',
                picture: null,
                meta: {}
            },
            {
                id: '2302124',
                author: '14900963',
                date: '2232132695',
                text: 'или?',
                picture: null,
                meta: {}
            },
            {
                id: '2302125',
                author: '15300194',
                date: '2232132123',
                text: 'Давай на месте разберемся',
                picture: null,
                meta: {}
            },
            {
                id: '2302126',
                author: '15300194',
                date: '2232132123',
                text: 'либо, если тебе нужно заранее это узнать',
                picture: null,
                meta: {}
            },
            {
                id: '2302127',
                author: '14900963',
                date: '2232132695',
                text: 'Да нет, без разницы!',
                picture: null,
                meta: {}
            },
            {
                id: '2302112',
                author: '14900963',
                date: '2232132123',
                text: 'Сегодня в 20:20 всреча в офисе Яндекса',
                picture: null,
                meta: {}
            },
            {
                id: '2302165',
                author: '14900963',
                date: '2232132695',
                text: 'и там будет...',
                picture: null,
                meta: {}
            },
            {
                id: '2302175',
                author: '15300194',
                date: '2232132123',
                text: 'кто?',
                picture: null,
                meta: {}
            },
            {
                id: '2302176',
                author: '15300194',
                date: '2232132123',
                text: 'Я просто все прослушал',
                picture: null,
                meta: {}
            },
            {
                id: '2302197',
                author: '14900963',
                date: '2232132695',
                text: 'Скажу тебе потом лично',
                picture: null,
                meta: {}
            },
            {
                id: '2302111',
                author: '15300194',
                date: '2232132123',
                text: 'Пойдем в кино',
                picture: null,
                meta: {}
            },
            {
                id: '2302131',
                author: '14900963',
                date: '2232132695',
                text: 'Го',
                picture: null,
                meta: {}
            }
        ];

        this.setState({
            user,
            openChat,
            messages
        });
    }

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

    onChange = e => {
        const attachments = this.state.attachments || [];

        const { currentTarget: { files } } = e;

        [...files].forEach(file => {
            attachments.push(file);
        });

        this.setState({ attachments });
        this.togglePreview([...files], attachments);
    }

    render() {
        const { showProfile } = this.props;
        const { user, openChat, messages, msgText } = this.state;

        return (
            <React.Fragment>
                {openChat === null ? (
                    <section className="chat-window">
                        <img src="/static/main-label-bw.svg" className="chat-window__stub" />
                    </section>
                ) : (
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
                            {messages.map(message => (
                                <Message
                                    key={message.id}
                                    message={message}
                                    user={user}
                                    title={openChat.title}
                                />
                            ))}
                        </div>
                        <Preview files={this.state.attachments} />
                        <div className="chat-input chat-input_separator_box-shadow">
                            <input
                                value={msgText}
                                onChange={this.changeText}
                                type="text"
                                className="chat-input__write-field"
                            />
                            <label className="chat-input__emoji-btn chat-input__button">
                                <input
                                    type="button"
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
                                    onChange={this.onChange}
                                />
                                <img
                                    src="/static/camera.svg"
                                    className="chat-input__attachment-icon"
                                />
                            </label>
                            <div
                                onClick={this.submit}
                                className="chat-input__send-btn chat-input__button"
                            />
                        </div>
                    </section>
                )}
            </React.Fragment>
        );
    }
}

ChatWindow.propTypes = {
    user: PropTypes.object,
    openChat: PropTypes.object,
    showProfile: PropTypes.func
};
