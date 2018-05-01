'use strict';

const initialState = null;

export default function user(state = initialState, action) {
    if (action.type === 'LOGIN_USER') {
        return {
            ...state,
            user: action.user
        };
    }

    if (action.type === 'SHOW_PROFILE') {
        return {
            ...state,
            profile: action.profile
        };
    }

    if (action.type === 'HIDE_PROFILE') {
        return {
            ...state,
            profile: null
        };
    }

    return state;
}
