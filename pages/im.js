'use strict';

import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import Header from '../blocks/chats-page/Header';
import Chats from '../blocks/chats-page/Chats';
import ChatWindow from '../blocks/chats-page/ChatWindow';

import 'isomorphic-fetch';
import './global-const.css';
import './im.css';

const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class ProfilePage extends Component {
    state = {
        chats: null,
        user: null,
        chatProps: null,
        currentChat: null
    };

    click = chatProps => this.setState({ chatProps });

    changeLastMessage = (id, msg) => {
        const { chats } = this.state;

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

    componentDidMount() {
        const value = localStorage.getItem('test');

        /* eslint-disable-next-line react/no-did-mount-set-state */
        this.setState({
            currentChat: value
        });
    }

    render() {
        const { chats, user, chatProps } = this.state;

        return (
            <React.Fragment>
                <head>
                    <title>K1loCha7</title>
                </head>
                <Header />
                <div>
                    {this.state.currentChat}
                </div>
                <main className="main">
                    <article className="chats">
                        <div className="chats__search">
                            <input
                                type="text"
                                className="chats__search-input"
                                placeholder="Найти пользователя по id..."
                                onKeyPress={this.searchUser}
                            />
                        </div>
                        <div className="chats__list">
                            <Chats chatsList={chats} click={this.click} />
                        </div>
                    </article>
                    <ChatWindow
                        user={user}
                        chatProps={chatProps}
                        changeLastMessage={this.changeLastMessage}
                    />
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

// Перекладываем в state сразу из props
ProfilePage.getDerivedStateFromProps = ({ chats, user }) => {
    return { chats, user };
};

ProfilePage.propTypes = { };
