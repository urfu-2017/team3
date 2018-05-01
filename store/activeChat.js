'use strict';

const intitialState = null;
const defaultMessages = [
    {
        id: '1',
        text: 'Привет перец',
        author: '14900963',
        date: Date.now(),
        meta: null
    },
    {
        id: '2',
        text: 'Привет перец!!!',
        date: Date.now(),
        author: '14900963',
        meta: null
    }
];

export default function activeChat(state = intitialState, action) {
    if (action.type === 'OPEN_CHAT') {
        return action.chat;
    }

    return state;
}
