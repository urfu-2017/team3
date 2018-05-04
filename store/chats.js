'use strict';

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
