'use strict';

import { notifyMessage } from '../utils/notification';
import getSocket from '../pages/socket';

import types from './types';

export const createChat = (myUser, user) => dispatch => { // туду private
    const socket = getSocket();

    dispatch({ type: types.SHOW_LOADER });
    dispatch({ type: types.HIDE_ADDUSER });

    socket.emit('chat', {
        members: [myUser.nickname, user.nickname], // Важно! создатель первый в списке
        type: 'private'
    }, (chat, existsChatId) => {
        if (chat) {
            dispatch({ type: types.CREATE_CHAT, chat });
            dispatch({ type: types.OPEN_CHAT, id: chat._id });
            socket.emit('join', [chat._id]);
        } else {
            dispatch({ type: types.OPEN_CHAT, id: existsChatId });
        }
        dispatch({ type: types.HIDE_LOADER });
    });
};

export const createGroupChat = (myUser, otherMembers, groupTitle) => dispatch => {
    const socket = getSocket();

    dispatch({ type: types.HIDE_CREATEGROUP });
    dispatch({ type: types.SHOW_LOADER });

    socket.emit('chat', {
        title: groupTitle,
        members: [myUser, ...otherMembers].map(m => m.nickname), // Важно! создатель первый в списке
        type: 'group'
    }, chat => {
        dispatch({ type: types.CREATE_CHAT, chat });
        dispatch({ type: types.OPEN_CHAT, id: chat._id });
        dispatch({ type: types.HIDE_LOADER });

        socket.emit('join', [chat._id]);
    });
};

export const openChat = id => dispatch => {
    dispatch({ type: types.OPEN_CHAT, id });
};

export const receiveChat = chat => dispatch => {
    dispatch({ type: types.CREATE_CHAT, chat });
};

export const receiveMessage = (chatId, message) => (dispatch, getState) => {
    const { user, chats, activeChat } = getState();
    const chat = chats.find(c => c._id === chatId);

    dispatch({ type: types.RECEIVE_MESSAGE, chatId, message });

    const onclick = () => {
        window.focus();
        dispatch(openChat(chat._id));
    };

    notifyMessage({ message, chat, user, activeChat, onclick });
};

export const updateMessage = (chatId, message) => dispatch => {
    dispatch({ type: types.UPDATE_MESSAGE, chatId, message });
};

export const updateChat = chat => dispatch => {
    dispatch({ type: types.UPDATE_CHAT, chat });
};

export const destructMessage = (chatId, messageId) => dispatch => {
    dispatch({ type: types.DESTRUCT_MESSAGE, chatId, messageId });
};

export const updateSearchMessages = messages => dispatch => {
    dispatch({ type: 'UPDATE_SEARCHMESSAGES', messages });
};

export const showSearchMessages = () => dispatch => {
    dispatch({ type: 'SHOW_SEARCHMESSAGES' });
};

export const hideSearchMessages = () => dispatch => {
    dispatch({ type: 'HIDE_SEARCHMESSAGES' });
};
