'use strict';

const initialState = null;

export default function user(state = initialState, action) {
    if (action.state === 'LOGIN_USER') {
        return action.user;
    }

    return state;
}
