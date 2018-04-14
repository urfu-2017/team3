'use strict';

/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */

import fetch from 'node-fetch';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from '../common-components/Message';

import './ChatWindow.css';

// const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class ChatWindow extends Component {
    // user - я, id/title - собеседника ид и имя

    state = { user: null, id: null, title: null, messages: [], msgText: '' };

    async componentWillReceiveProps(nextProps) {
        // Если приходят chatProps - значит нажали на диалог, отсекаем первый холостой
        // И отрезаем нажатие на открытый диалог
        if (nextProps.chatProps && nextProps.chatProps.id !== this.state.id) {
            this.setState({ messages: [] });
            const { chatProps, user } = nextProps;
            const { id, title } = chatProps;

            this.setState({ user, id, title, msgText: '' });

            const response = await fetch(`/api/chats/${id}/messages`);
            const messages = await response.json();

            this.setState({ messages });
        }
    }

    componentDidMount() {
        setInterval(async () => {
            console.log('Привет');
            const response = await fetch(`/api/chats/${this.state.id}/messages`);
            const messages = await response.json();

            this.setState({ messages });
        }, 1000);
    }

    change = event => this.setState({ msgText: event.target.value });

    submit = async () => {
        const response = await fetch(`/api/chats/${this.state.id}/messages`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: this.state.msgText })
        });

        if (response.status === 200 || response.status === 201) {
            /* eslint prefer-const: 0*/
            const createdMessage = await response.json();

            let messagesNow = this.state.messages;

            messagesNow.push(createdMessage);
            // this.props.changeLastMessage(this.state.id, this.state.msgText);
            this.setState({ messages: messagesNow, msgText: '' });
        }
    };
    render() {
        const { user, id, title, messages, msgText } = this.state;
        // const { changeLastMessage } = this.props;

        return (
            <React.Fragment>
                {id === null
                    ?
                        <section className="chat-window">
                            <img
                                src="/static/main-label-bw.svg"
                                className="chat-window__stub"
                            />
                        </section>
                    :
                        <section className="chat-window">
                            <div className="chat-window__title">Открыт диалог с {title}</div>
                            <div className="chat-window__messages">
                                {messages.map(message => (
                                    <Message
                                        key={message.id}
                                        message={message}
                                        user={user}
                                        title={title}
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
            </React.Fragment>
        );
    }
}

ChatWindow.getInitialProps = () => {
    // Пустует
};

ChatWindow.propTypes = { chatProps: PropTypes.object };
ChatWindow.propTypes = { user: PropTypes.object };
// ChatWindow.propTypes = { changeLastMessage: PropTypes.function };
