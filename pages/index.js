'use strict';

import fetch from 'node-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';

import { receiveChat, openChat, updateMessage, receiveMessage } from '../actions/chats';
import types from '../actions/types';
import makeStore from '../store';

import Chats from '../blocks/chats/Chats';
import ChatWindow from '../blocks/chat-window/ChatWindow';
import Search from '../blocks/modals/search/Search';
import Profile from '../blocks/modals/profile/Profile';
import AddUser from '../blocks/modals/add-user/AddUser';
import Contacts from '../blocks/modals/contacts/Contacts';
import CreateGroup from '../blocks/modals/create-group/CreateGroup';
import Loader from '../blocks/modals/loader/Loader';

import 'isomorphic-fetch';
import './global-const.css';
import './index.css';

import getSocket from './socket';

class MainPage extends React.Component {
    static async getInitialProps({ store, req }) {
        if (!req) {
            return {};
        }

        await this.initState(store, req);

        return { invite: req.params.id };
    }

    static async initState(store, req) {
        store.dispatch({ type: types.LOGIN_USER, user: req.user });
        store.dispatch(await loadChats(req));
    }

    connectToRooms(socket) {
        const rooms = this.props.chats.map(c => c._id);

        rooms.push(this.props.user.nickname);
        socket.emit('join', rooms);
    }

    setupReceiveMessage(socket) {
        socket.on('message', data => {
            const { chatId, message } = data;

            this.props.receiveMessage(chatId, message);
        });
    }

    setupReceiveChat(socket) {
        socket.on('chat', chat => {
            this.props.receiveChat(chat);
            socket.emit('join', [chat._id]);
        });
    }

    setupUpdateMessage(socket) {
        socket.on('update_message', data => {
            this.props.updateMessage(data.chatId, data.message);
        });
    }

    componentDidMount() {
        const socket = getSocket();

        this.connectToRooms(socket);
        this.setupReceiveMessage(socket);
        this.setupReceiveChat(socket);
        this.setupUpdateMessage(socket);

        this.acceptInvite(socket, this.props.user, this.props.invite);
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
                this.props.receiveChat(chat);
                socket.emit('join', [chat._id]);
            }

            this.props.openChat(chat ? chat._id : existingChatId);
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
    receiveMessage: PropTypes.func,
    openChat: PropTypes.func,
    invite: PropTypes.string,
    updateMessage: PropTypes.func,
    receiveChat: PropTypes.func
};

export default withRedux(makeStore,
    state => state, {
        receiveMessage,
        receiveChat,
        openChat,
        updateMessage
    }
)(MainPage);

async function loadChats(req) {
    const { HOST, PORT } = process.env;
    const res = await fetch(`${HOST}:${PORT}/api/chats`, {
        credentials: 'include',
        headers: {
            cookie: req.headers.cookie
        }
    });
    const chats = await res.json();

    return { type: types.LOAD_CHATS, chats };
}
