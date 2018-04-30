'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Chats from '../blocks/chats-page/Chats';
import ChatWindow from '../blocks/chats-page/ChatWindow';

import 'isomorphic-fetch';
import './global-const.css';
import './im.css';

const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.setState({
            chats: null,
            user: null,
            chatProps: null
        });
    }

    click = chatProps => {
        localStorage.setItem('chatProps', JSON.stringify(chatProps));
        this.setState({ chatProps });
    };

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

    componentWillUpdate() {
        this.props.chatProps = JSON.parse(this.state.chatProps);
    }

    componentDidMount() {
        const chatPropsFromLS = localStorage.getItem('chatProps');

        /* eslint-disable-next-line react/no-did-mount-set-state */
        this.setState({
            chatProps: JSON.parse(chatPropsFromLS)
        });
    }

    render() {
        const { chats, user, chatProps } = this.state;

        return (
            <React.Fragment>
                <head>
                    <title>K1loCha7</title>
                </head>
                <main className="main">
                    <article className="chats">
                        <div className="chats__search">
                            <input
                                type="text"
                                className="chats__search-input"
                                placeholder="Найти пользователя"
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

MainPage.getInitialProps = async ({ req }) => {
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
MainPage.getDerivedStateFromProps = ({ chats, user }) => {
    return { chats, user };
};

MainPage.propTypes = {
    chatProps: PropTypes.object
};
