'use strict';

export default function user(state = null, action) {
    if (action.type === 'LOGIN_USER') {
        return action.user;
    }

    return state;
}
