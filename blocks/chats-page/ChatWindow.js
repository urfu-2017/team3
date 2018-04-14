'use strict';

/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */

import fetch from 'node-fetch';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from '../common-components/Message';

import './ChatWindow.css';

const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class ChatWindow extends Component {
    // user - я, id/name - собеседника ид и имя

    state = { user: null, id: null, name: null, messages: [], msgText: '' };

    async componentWillReceiveProps(nextProps) {
        // Если приходят chatProps - значит нажали на диалог, отсекаем первый холостой
        // И отрезаем нажатие на открытый диалог
        if (nextProps.chatProps && nextProps.chatProps.id !== this.state.id) {
            const { chatProps } = nextProps.chatProps;
            const { user } = nextProps.user;
            const { id, name } = chatProps;

            this.setState({ user, id, name, msgText: '' });

            const response = await fetch(`${URL}/api/chats/${id}/messages`);
            const messages = await response.json();

            this.setState({ messages });
        }
    }

    change = event => this.setState({ msgText: event.target.value });

    submit = async () => {
        const response = await fetch(`${URL}/api/chats/${this.state.id}/messages`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: this.state.msgText })
        });

        if (res.status === 201) {
            const createdMessage = await response.json();

            this.state.messages.push(createdMessage);
            // this.props.changeLastMessage(this.state.id, this.state.msgText);
            this.setState({ messages, msgText: '' });
        }
    };

    render() {
        const { user, id, name, messages, msgText } = this.state;
        // const { changeLastMessage } = this.props;

        return (
            <nav className="dialog">
                {id === null
                    ?
                        <section className="chat-window">
                            <div className="chat-window__title">Открой диалог</div>
                        </section>
                    :
                        <section className="chat-window">
                            <div className="chat-window__title">Открыт диалог с {name}</div>
                            <div className="chat-window__messages">
                                {messages.map(message => (
                                    <Message
                                        key={message.id}
                                        message={message}
                                        user={user}
                                        name={name}
                                    />
                                ))}
                            </div>
                            <div className="chat-window__write">
                                <input
                                    value={msgText}
                                    onChange={this.change}
                                    type="text"
                                    className="chat-window__input"
                                />
                                <div
                                    onClick={this.submit}
                                    className="chat-window__send-btn"
                                    >
                                    send
                                </div>
                            </div>
                        </section>
                }
            </nav>
        );
    }
}

ChatWindow.getInitialProps = () => {
    // Пустует
};

ChatWindow.propTypes = { chatProps: PropTypes.object };
ChatWindow.propTypes = { user: PropTypes.string };
// ChatWindow.propTypes = { changeLastMessage: PropTypes.function };
