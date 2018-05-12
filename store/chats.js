'use strict';

import Chat from '../models/Chat';

/* eslint complexity: 0 */
/* eslint max-statements: 0 */

export default function chats(state = [], action) {
    if (action.type === 'LOAD_CHATS') {
        return action.chats.sort(compareByLastMessage);
    }

    if (action.type === 'RECEIVE_MESSAGE') {
        return pushMessage(state, action.chatId, action.message)
            .sort(compareByLastMessage);
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
        return updateMessage(state, action.chatId, action.message);
    }

    if (action.type === 'UPDATE_CHAT') {
        return updateChat(state, action.chat);
    }

    return state;
}

function pushMessage(oldChats, chatId, message) {
    return updateChatImmutable(oldChats, chatId, oldChat => {
        return {
            ...oldChat,
            messages: [...oldChat.messages, message]
        };
    });
}

function updateMessage(oldChats, chatId, message) {
    return updateChatImmutable(oldChats, chatId, oldChat => {
        const newMessages = [...oldChat.messages];
        const messageIndex = newMessages.findIndex(m => m._id === message._id);

        newMessages[messageIndex] = message;

        return {
            ...oldChat,
            messages: newMessages
        };
    });
}

function updateChat(oldChats, updatedChat) {
    return updateChatImmutable(oldChats, updatedChat._id, oldChat => {
        return {
            ...oldChat,
            ...updatedChat };
    });
}

function updateChatImmutable(oldChats, chatId, getNewChat) {
    const newChats = [...oldChats];
    const chatIndex = newChats.findIndex(c => c._id === chatId);
    const oldChat = newChats[chatIndex];
    const newChat = getNewChat(oldChat);

    newChats[chatIndex] = newChat;

    return newChats;
}

function compareByLastMessage(a, b) {
    const aLastMessage = new Chat(a).getLastMessage();
    const bLastMessage = new Chat(b).getLastMessage();

    if (!aLastMessage && !bLastMessage) {
        return b._id.localeCompare(a._id);
    }

    if (bLastMessage && aLastMessage) {
        return new Date(bLastMessage.date) - new Date(aLastMessage.date);
    }

    // чатик в котором есть сообщение всегда раньше
    return aLastMessage ? -1 : 1;
}
