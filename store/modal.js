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

    if (action.type === 'CHANGE_AVATAR') {
        return {
            ...state,
            profile: {
                ...state.profile,
                avatar: action.avatar
            }
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
            showCG: true,
            availableUsers: action.availableUsers,
            groupMembers: action.groupMembers
        };
    }

    if (action.type === 'HIDE_CREATEGROUP') {
        return {
            ...state,
            showCG: false
        };
    }

    if (action.type === 'INCLUDE_IN_NEW_GROUP') {
        return {
            ...state,
            availableUsers: state.availableUsers.filter(u => u.nickname !== action.user.nickname),
            groupMembers: [...state.groupMembers, action.user]
        };
    }

    if (action.type === 'EXCLUDE_FROM_NEW_GROUP') {
        return {
            ...state,
            availableUsers: [...state.availableUsers, action.user]
                .sort((a, b) => a.nickname.localeCompare(b.nickname)),
            groupMembers: state.groupMembers.filter(u => u.nickname !== action.user.nickname)
        };
    }

    if (action.type === 'FOUND_USERS') {
        return {
            ...state,
            foundUsers: action.foundUsers
        };
    }

    if (action.type === 'CLEAR_FOUND_USERS') {
        return {
            ...state,
            foundUsers: []
        };
    }

    if (action.type === 'SHOW_WARNING') {
        return {
            ...state,
            warning: action.text
        };
    }
    if (action.type === 'HIDE_WARNING') {
        return {
            ...state,
            warning: ''
        };
    }

    if (action.type === 'HIDE_FULL_SIZE_IMAGE') {
        return {
            ...state,
            fullSizeImg: ''
        };
    }

    if (action.type === 'SHOW_FULL_SIZE_IMAGE') {
        return {
            ...state,
            fullSizeImg: action.fullSizeImg
        };
    }

    return state;
}
