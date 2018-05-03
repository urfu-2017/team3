'use strict';

export default function modal(state = {}, action) {
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

    if (action.type === 'FOUND_USERS') {
        return {
            ...state,
            foundUsers: action.foundUsers
        };
    }

    return state;
}
