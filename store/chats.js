'use strict';

export default function chats(state = [], action) {
    if (action.type === 'LOAD_CHATS') {
        return action.chats;
    }

    if (action.type === 'RECIVE_MESSAGE') {
        const newState = [...state];
        const chatIndex = newState.findIndex(c => c._id === action.chatId);
        const oldChat = newState[chatIndex];
        const newChat = {
            ...oldChat,
            messages: [...oldChat.messages, action.message]
        };

        newState[chatIndex] = newChat;

        return newState;
    }

    return state;
}
