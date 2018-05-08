'use strict';

import fetch from 'node-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';

import makeStore from '../store';
import Chats from '../blocks/chats-page/Chats';
import Search from '../blocks/chats-page/Search';
import ChatWindow from '../blocks/chats-page/ChatWindow';
import Profile from '../blocks/pfl/profile';
import AddUser from '../blocks/common-components/AddUser';
import Contacts from '../blocks/common-components/Contacts';
import CreateGroup from '../blocks/common-components/CreateGroup';
import Loader from '../blocks/loader/Loader';

import 'isomorphic-fetch';
import './global-const.css';
import './index.css';

import getSocket from './socket';

async function loadChats(req) {
    const { HOST, PORT } = process.env;
    const res = await fetch(`${HOST}:${PORT}/api/chats`, {
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
        if (!req) {
            return {};
        }

        store.dispatch({ type: 'LOGIN_USER', user: req.user });
        store.dispatch(await loadChats(req));
        if (req.params.id) {
            store.dispatch({ type: 'ACCEPT_INVITE', invite: req.params.id });
        }

        return {};
    }

    componentDidMount() {
        const socket = getSocket();

        const { user } = this.props;
        // Подключение ко всем комнатам с чатиками
        const rooms = this.props.chats.map(c => c._id);

        rooms.push(user.nickname);
        socket.emit('join', rooms);

        this.acceptInvite(socket, user, this.props.invite);

        socket.on('message', data => {
            const { chatId, message } = data;

            this.props.onReceiveMessage(chatId, message);
        });

        socket.on('chat', chat => {
            this.props.onCreateChat(chat);
            socket.emit('join', [chat._id]);
        });

        socket.on('update_message', data => {
            this.props.onUpdateMessage(data);
        });
    }

    acceptInvite(socket, user, invite) {
        if (invite) {
            Router.push('/');

            if (invite.startsWith('g_')) {
                const inviteId = invite.substr(2);

                this.acceptInviteInternal(socket, {
                    inviteId,
                    type: 'group',
                    currentUser: user.nickname
                });
            } else {
                this.acceptInviteInternal(socket, {
                    members: [user.nickname, invite],
                    type: 'private'
                });
            }
        }
    }

    acceptInviteInternal(socket, description) {
        socket.emit('chat', description, (chat, existingChatId) => {
            if (chat) {
                this.props.onCreateChat(chat);
                socket.emit('join', [chat._id]);
            }

            this.props.onOpenChat(chat ? chat._id : existingChatId);
        });
    }

    render() {
        return (
            <React.Fragment>
                <main className="main main_theme_day">
                    <article className="chats">
                        <div className="chats__search">
                            <Search />
                        </div>
                        <hr />
                        <div className="chats__list">
                            <Chats />
                        </div>
                    </article>
                    <article className="dialog">
                        <ChatWindow />
                    </article>
                    <Profile />
                    <AddUser />
                    <CreateGroup />
                    <Contacts />
                    <Loader />
                </main>
            </React.Fragment>
        );
    }
}

MainPage.propTypes = {
    user: PropTypes.object,
    chats: PropTypes.array,
    onReceiveMessage: PropTypes.func,
    onCreateChat: PropTypes.func,
    onOpenChat: PropTypes.func,
    invite: PropTypes.string,
    onUpdateMessage: PropTypes.func
};

export default withRedux(makeStore,
    state => state,
    dispatch => ({
        onReceiveMessage: (chatId, message) => {
            dispatch({ type: 'RECEIVE_MESSAGE', chatId, message });
        },
        onCreateChat: chat => {
            dispatch({ type: 'CREATE_CHAT', chat });
        },
        onOpenChat: chatId => {
            dispatch({ type: 'OPEN_CHAT', id: chatId });
        },
        onUpdateMessage: ({ chatId, message }) => {
            dispatch({ type: 'UPDATE_MESSAGE', chatId, message });
        }
    })
)(MainPage);
