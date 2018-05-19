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

        return [...state, action.chat].sort(compareByLastMessage);
    }

    if (action.type === 'UPDATE_MESSAGE') {
        return updateMessage(state, action.chatId, action.message);
    }

    if (action.type === 'UPDATE_CHAT') {
        return updateChat(state, action.chat);
    }

    if (action.type === 'DESTRUCT_MESSAGE') {
        return destructMessage(state, action.chatId, action.messageId);
    }

    if (action.type === 'UPDATE_BATTERY_LEVEL') {
        return state.map(chat => {
            return {
                ...chat,
                members: chat.members.map(member => {
                    if (member.nickname !== action.userNickname) {
                        return member;
                    }

                    return { ...member, battery: action.battery };
                })
            };
        });
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

function destructMessage(oldChats, chatId, messageId) {
    return updateChatImmutable(oldChats, chatId, oldChat => {
        return {
            ...oldChat,
            messages: oldChat.messages.filter(m => m._id !== messageId)
        };
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
    const aDate = new Chat(a).getDate();
    const bDate = new Chat(b).getDate();

    return new Date(bDate) - new Date(aDate);
}
