'use strict';

import fetch from 'node-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';

import makeStore from '../store';
import Chats from '../blocks/chats-page/Chats';
import Search from '../blocks/chats-page/Search';
import ChatWindow from '../blocks/chats-page/ChatWindow';
import Profile from '../blocks/pfl/profile';
import AddUser from '../blocks/common-components/AddUser';
import Contacts from '../blocks/common-components/Contacts';
import CreateGroup from '../blocks/common-components/CreateGroup';

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
        store.dispatch({ type: 'LOGIN_USER', user: req.user });
        store.dispatch(await loadChats(req));

        return { };
    }

    componentDidMount() {
        const socket = getSocket();

        const { user } = this.props;
        // Подключение ко всем комнатам с чатиками
        const rooms = this.props.chats.map(c => c._id);

        rooms.push(user.nickname);
        socket.emit('join', rooms);

        socket.on('message', data => {
            const { chatId, message } = data;

            this.props.onReceiveMessage(chatId, message);
        });

        socket.on('chat', chat => {
            this.props.onCreateChat(chat);
        });
    }

    render() {
        return (
            <React.Fragment>
                <main className="main">
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
                </main>
                <Profile />
                <AddUser />
                <CreateGroup />
                <Contacts />
            </React.Fragment>
        );
    }
}

MainPage.propTypes = {
    user: PropTypes.object,
    chats: PropTypes.array,
    onReceiveMessage: PropTypes.func,
    onCreateChat: PropTypes.func
};

export default withRedux(makeStore,
    state => state,
    dispatch => ({
        onReceiveMessage: (chatId, message) => {
            dispatch({ type: 'RECEIVE_MESSAGE', chatId, message });
        },
        onCreateChat: chat => {
            dispatch({ type: 'CREATE_CHAT', chat });
        }
    })
)(MainPage);
