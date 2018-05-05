'use strict';

export default function user(state = null, action) {
    if (action.type === 'LOGIN_USER') {
        return action.user;
    }

    if (action.type === 'CHANGE_AVATAR') {
        return {
            ...state,
            avatar: action.avatar
        };
    }

    return state;
}
