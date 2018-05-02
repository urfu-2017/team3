'use strict';

export default function chats(state = [], action) {
    if (action.type === 'LOAD_CHATS') {
        return action.chats;
    }

    if (action.type === 'RECIVE_MESSAGE') {
        return pushMessageImmutable(state, action.chatId, action.message);
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
