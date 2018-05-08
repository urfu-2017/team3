'use strict';

/* eslint complexity: 0 */
/* eslint max-statements: 0 */

export default function chats(state = [], action) {
    if (action.type === 'LOAD_CHATS') {
        return action.chats.sort(sortByLastMessage);

        // return action.chats.reverse();
    }

    if (action.type === 'SORT_CHATS') {
        let localState = state;

        // concat([]) - для того, чтобы перерендер произошел, неизвестно зачем
        return localState.sort(sortByLastMessage).concat([]);
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
    message.date = new Date(message.data);
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

function sortByLastMessage(a, b) {
    let aTime = 0;

    if (a.messages.length) {
        aTime = a.messages[a.messages.length - 1].date;
    }

    aTime = new Date(aTime);
    aTime = aTime.getTime();

    let bTime = 0;

    if (b.messages.length) {
        bTime = b.messages[b.messages.length - 1].date;
    }

    bTime = new Date(bTime);
    bTime = bTime.getTime();

    return bTime - aTime;
}
