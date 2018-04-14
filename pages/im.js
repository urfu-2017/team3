'use strict';

/* eslint-disable no-undef */

import fetch from 'node-fetch';

import React, { Component } from 'react';

import Header from '../blocks/chats-page/Header';
import Chats from '../blocks/chats-page/Chats';
import ChatWindow from '../blocks/chats-page/ChatWindow';

import './global-const.css';
import './im.css';

const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class ProfilePage extends Component {
    state = {
        chats: null,
        user: null,
        chatProps: null
    };

    click = chatProps => this.setState({ chatProps });

    changeLastMessage = (id, msg) => {
        const { chats } = this.state.chats;

        chats.forEach(chat => {
            if (chat.id === id) {
                chat.lastMessage = msg;

                return;
            }
        });

        this.setState({ chats });
    }

    searchUser = async e => {
        if (e.key !== 'Enter') {
            return;
        }

        const value = e.target.value.toLowerCase();
        const response = await fetch(`/api/users/${value}`);

        if (response.status === 404) {
            console.info('User not found'); // show not found message here
        } else if (response.status === 200) {
            window.location.href = `/profile/${value}`;
        }
    }

    render() {
        const { chats, user, chatProps } = this.state;

        return (
            <React.Fragment>
                <head>
                    <title>K1loCha7</title>
                </head>
                <Header />
                <main className="main">
                    <article className="chats">
                        <div className="chats__search">
                            <input
                                type="text"
                                placeholder="Найти пользователя по id..."
                                className="chats__search-input"
                                onKeyPress={this.searchUser}
                            />
                        </div>
                        <div className="chats__list">
                            <Chats chatsList={chats} click={this.click} />
                        </div>
                    </article>
                    <article className="dialog">
                        <ChatWindow
                            user={user}
                            chatProps={chatProps}
                            changeLastMessage={this.changeLastMessage}
                        />
                    </article>
                </main>
            </React.Fragment>
        );
    }
}

ProfilePage.getInitialProps = async ({ req }) => {
    const { user } = req;

    const response = await fetch(`${URL}/api/chats`, {
        credentials: 'include',
        headers: {
            cookie: req.headers.cookie
        }
    });

    const chats = await response.json();

    return { chats, user };
};

ProfilePage.getDerivedStateFromProps = ({ chats, user }) => {
    return { chats, user };
};
