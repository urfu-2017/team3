'use strict';

/* eslint react/jsx-no-bind: 0 */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

import fetch from 'node-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import { Provider } from 'react-redux';

import makeStore from '../store';
import Chats from '../blocks/chats-page/Chats';
import Search from '../blocks/chats-page/Search';
import ChatWindow from '../blocks/chats-page/ChatWindow';
import Profile from '../blocks/pfl/profile';
import PureProfile from '../blocks/common-components/PureProfileForList';

import 'isomorphic-fetch';
import './global-const.css';
import './im.css';

import getSocket from './socket';

async function loadChats(req) {
    const res = await fetch('http://localhost:3000/api/chats', {
        credentials: 'include',
        headers: {
            cookie: req.headers.cookie
        }
    });
    const chats = await res.json();

    return { type: 'LOAD_CHATS', chats };
}

class MainPage extends React.Component {
    static async getInitialProps({ store, req }) {
        store.dispatch({ type: 'LOGIN_USER', user: req.user });
        store.dispatch(await loadChats(req));

        return { };
    }

    componentDidMount() {
        const socket = getSocket();

        // Подключение ко всем комнатам с чатиками
        socket.emit('join', this.props.chats.map(c => c._id));

        socket.on('message', data => {
            const { chatId, message } = data;

            this.props.onReciveMessage(chatId, message);
        });

        socket.emit('message', { message: '123' });
    }

    // showUserProfile - хранит или null или юзера котрого нужно показать!
    state = { user: null, chats: null, showUserProfile: null, openChat: null, foundUsersList: false }
    createChat = async interlocutor => {
        const response = await fetch('api/chats/', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                members: [interlocutor, this.props.user.nickname],
                type: 'private'
            })
        });

        if (response.status === 200) {
            const createdChat = await response.json();

            this.state.chats.push(createdChat);
        }
    }

    showFoundResults = userList => this.setState({ foundUsersList: userList });

    showFoundUsers = () => {
        return this.state.foundUsersList.map(user => {
            return (
                <PureProfile
                    key={user.nickname}
                    user={user}
                    createChat={this.createChat}
                />
            );
        });
    }

    render() {
        const showUserProfile = false;
        const { user, chats } = this.props;

        return (
            <React.Fragment>
                <head>
                    <title>{user.nickname}</title>
                </head>
                <main className="main">
                    <div>{ this.props.store }</div>
                    <article className="chats">
                        <div className="chats__search">
                            <Search
                                user={user}
                                showProfile={this.showProfile}
                                findUsers={this.showFoundResults}
                            />
                        </div>
                        <div className="chats__list">
                            <Chats chatsList={chats} clickToOpenChat={this.clickToOpenChat} />
                        </div>
                        {this.state.foundUsersList
                            ?
                                <div className="chats__found-users">
                                    {this.showFoundUsers()}
                                </div>
                            :
                            null
                        }

                    </article>
                    <article className="dialog">
                        <ChatWindow />
                    </article>
                </main>
                <Profile />
            </React.Fragment>
        );
    }
}

MainPage.propTypes = {
    user: PropTypes.object,
    store: PropTypes.string,
    chats: PropTypes.array
};

export default withRedux(makeStore,
    state => state,
    dispatch => ({
        onReciveMessage: (chatId, message) => {
            dispatch({ type: 'RECIVE_MESSAGE', chatId, message });
        }
    })
)(MainPage);
