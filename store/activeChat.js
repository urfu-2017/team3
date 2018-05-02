'use strict';

/* eslint-disable complexity */
/* eslint-disable max-statements */
export default function activeChat(state = null, action) {
    if (action.type === 'OPEN_CHAT') {
        return {
            ...state,
            ...action.chat
        };
    }

    if (action.type === 'SHOW_EMOJI') {
        return {
            ...state,
            showEmoji: true
        };
    }

    if (action.type === 'HIDE_EMOJI') {
        return {
            ...state,
            showEmoji: false
        };
    }

    if (action.type === 'RECIVE_MESSAGE' && state && action.chatId === state._id) {
        return {
            ...state,
            messages: [...state.messages, action.message]
        };
    }

    if (action.type === 'ADD_ATTACHMENT') {
        // Обработка добавляение атачмента
    }

    if (action.type === 'DELETE_ATTACHMENT') {
        // Обработка удаления атачмента
    }

    return state;
}
