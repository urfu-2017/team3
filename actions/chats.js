'use strict';

import Chat from '../models/Chat';
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
    const { user, chats } = getState();
    const chat = new Chat(chats.find(c => c._id === chatId));

    dispatch({ type: types.RECEIVE_MESSAGE, chatId, message });
    notifyMessage({ message, chat, user, dispatch });
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

function notifyMessage({ message, chat, user, dispatch }) {
    const chatInfo = chat.type === 'group' ? ` in ${chat.title}` : '';
    const title = `@${message.author}${chatInfo}`;
    const body = message.forwardFrom
        ? message.forwardFrom.text
        : message.text;
    const icon = chat.getAvatarFor(user).replace('.svg', '.png');

    const onclick = () => {
        window.focus();
        dispatch(openChat(chat._id));
    };

    notify({ title, body, icon, onclick });
}

function notify({ title, body, icon, sound, onclick, vibrate, checkVisibility = true }) {
    if (checkVisibility && !document.hidden) {
        return;
    }

    if (!('Notification' in window)) {
        return;
    }

    Notification.requestPermission(permission => {
        if (permission === 'granted') {
            const notification = new Notification(title, {
                icon,
                body,
                sound,
                vibrate
            });

            notification.onclick = () => onclick();
        }
    });
}
