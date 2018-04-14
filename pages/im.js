'use strict';

/* eslint-disable no-undef */

import fetch from 'node-fetch';

import React, { Component } from 'react';
import { Redirect } from 'react-router';

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
        chatProps: null,
        isRedirect: false
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
        const value = e.target.value.toLowerCase();
        const response = await fetch(`http://localhost:3000/api/users/${value}`);

        if (response.status === 200) {
            this.setState({ isRedirect: true });
        }
    }

    render() {
        const { chats, user, chatProps, isRedirect } = this.state;

        if (isRedirect) {
            return (
                <Redirect to="/profile" />
            );
        }

        return (
            <React.Fragment>
                <Header />
                <main className="main">
                    <article className="chats">
                        <div className="chats__search">
                            <input type="text" className="chats__search-input" />
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

// здесь линтер даже с дизейблом ругается на async/await,
// хотя у Гоголева ТАКОЙ ЖЕ КОМЬЮТЕР И ВСЕ РАБОТАЕТ
ProfilePage.getInitialProps = async ({ req }) => {
    const { user } = req;

    const response = await fetch(`${URL}/api/chats`, {
        credentials: 'include', headers: {
            cookie: req.headers.cookie
        }
    });

    const chats = await response.json();

    return { chats, user };
};

// Перекладываем в state сразу из props
ProfilePage.getDerivedStateFromProps = ({ chats, user }) => {
    return { chats, user };
};

// ProfilePage.propTypes = { user: PropTypes.object };
