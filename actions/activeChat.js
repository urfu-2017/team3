'use strict';

import getSocket from '../pages/socket';

import { receiveMessage } from './chats';

import types from './types';

export const addAttachments = files => async dispatch => {
    const attachments = await Promise.all(files.map(async file => {
        const formData = new FormData();

        formData.append('image', file);
        const response = await fetch('/api/attachments', {
            credentials: 'include',
            method: 'PUT',
            body: formData
        });

        if (response.status === 200) {
            const answer = await response.json();
            const { url } = answer;

            return { file, url };
        }

        return { file, url: 'http://fotki.ykt.ru/albums/userpics/15649/moeya.jpg' };
    }));

    dispatch({ type: types.ADD_ATTACHMENTS, attachments });
};

export const deleteAttachment = index => dispatch => {
    dispatch({ type: types.DELETE_ATTACHMENT, index });
};

export const hideInputPopup = () => dispatch => {
    dispatch({ type: types.HIDE_INPUT_POPUP });
};

export const showEmoji = () => dispatch => {
    dispatch({ type: types.SHOW_EMOJI });
};

export const hideEmoji = () => dispatch => {
    dispatch({ type: types.HIDE_EMOJI });
};

export const sendMessage = (chatId, message) => dispatch => {
    const socket = getSocket();

    socket.emit('message', { chatId, message },
        data => {
            dispatch(receiveMessage(data.chatId, data.message));
        });
};

export const resetAttachments = () => dispatch => {
    dispatch({ type: types.RESET_ATTACHMENTS });
};

export const showInputPopup = () => dispatch => {
    dispatch({ type: types.SHOW_INPUT_POPUP });
};

export const showAttachmentPreloader = isUploading => dispatch => {
    dispatch({ type: types.ATTACHMENTS_UPLOADING, isUploading });
};

export const setForward = message => dispatch => {
    const forwardMessage = getPayload(message);

    dispatch({ type: types.SET_FORWARD, forwardMessage });
};

export const deleteForward = () => dispatch => {
    dispatch({ type: types.DELETE_FORWARD });
};

export const setReply = message => dispatch => {
    const replyMessage = getPayload(message);

    dispatch({ type: types.SET_REPLY, replyMessage });
};

export const deleteReply = () => dispatch => {
    dispatch({ type: types.DELETE_REPLY });
};

export const setSelfDestructTimer = timer => dispatch => {
    dispatch({ type: types.SET_SELF_DESTRUCT, timer });
};

export const resetSelfDestructTimer = () => dispatch => {
    dispatch({ type: types.RESET_SELF_DESTRUCT });
};

export const showContacts = () => dispatch => {
    dispatch({ type: types.SHOW_CONTACTS_TO_FORWARD });
};

export const hideContacts = () => dispatch => {
    dispatch({ type: types.HIDE_CONTACTS_TO_FORWARD });
};

function getPayload(message) {
    const payload = message.forwardFrom
        ? { ...message.forwardFrom }
        : { ...message };

    delete payload.replyTo;
    delete payload.forwardFrom;

    return payload;
}
