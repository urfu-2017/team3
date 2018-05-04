'use strict';

/* eslint complexity: 0 */
/* eslint max-statements: 0 */

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

    if (action.type === 'SHOW_ADDUSER') {
        return {
            ...state,
            show: true
        };
    }

    if (action.type === 'HIDE_ADDUSER') {
        return {
            ...state,
            show: false
        };
    }

    if (action.type === 'SHOW_CREATEGROUP') {
        return {
            ...state,
            showCG: true
        };
    }

    if (action.type === 'HIDE_CREATEGROUP') {
        return {
            ...state,
            showCG: false
        };
    }

    if (action.type === 'SHOW_CONTACTS') {
        return {
            ...state,
            showContacts: true
        };
    }

    if (action.type === 'HIDE_CONTACTS') {
        return {
            ...state,
            showContacts: false
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
