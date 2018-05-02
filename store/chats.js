'use strict';

export default function chats(state = [], action) {
    if (action.type === 'LOAD_CHATS') {
        return action.chats;
    }

    return state;
}
