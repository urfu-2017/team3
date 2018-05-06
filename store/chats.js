'use strict';

/* eslint complexity: 0 */
/* eslint max-statements: 0 */

export default function chats(state = [], action) {
    if (action.type === 'LOAD_CHATS') {
        return action.chats;
    }

    if (action.type === 'RECEIVE_MESSAGE') {
        return pushMessageImmutable(state, action.chatId, action.message);
    }

    if (action.type === 'CREATE_CHAT') {
        // Не добавляем чатик, если он уже сущесвует
        // На случай если два пользователя одновременно создали чат
        if (state.find(chat => chat._id === action.chat._id)) {
            return state;
        }

        return [...state, action.chat];
    }

    if (action.type === 'UPDATE_MESSAGE') {
        return updateMessageImmutable(state, action.chatId, action.message);
    }

    return state;
}

function pushMessageImmutable(oldChats, chatId, message) {
    const newChats = [...oldChats];
    const chatIndex = newChats.findIndex(c => c._id === chatId);
    const oldChat = newChats[chatIndex];
    const newChat = {
        ...oldChat,
        messages: [...oldChat.messages, message]
    };

    newChats[chatIndex] = newChat;

    return newChats;
}

function updateMessageImmutable(oldChats, chatId, message) {
    const newChats = [...oldChats];
    const chatIndex = newChats.findIndex(c => c._id === chatId);
    const oldChat = newChats[chatIndex];
    const newMessages = [...oldChat.messages];
    const messageIndex = newMessages.findIndex(m => m._id === message._id);

    newMessages[messageIndex] = message;

    const newChat = {
        ...oldChat,
        messages: newMessages
    };

    newChats[chatIndex] = newChat;

    return newChats;
}
