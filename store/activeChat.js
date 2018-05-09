'use strict';

/* eslint-disable complexity */
/* eslint-disable max-statements */
export default function activeChat(state = null, action) {
    if (action.type === 'OPEN_CHAT') {
        return {
            ...state,
            id: action.id
        };
    }

    if (action.type === 'SHOW_EMOJI') {
        return {
            ...state,
            showEmoji: true
        };
    }

    if (action.type === 'HIDE_EMOJI') {
        return {
            ...state,
            showEmoji: false
        };
    }

    if (action.type === 'SHOW_INPUT_POPUP') {
        return {
            ...state,
            showInputPopup: true
        };
    }

    if (action.type === 'HIDE_INPUT_POPUP') {
        return {
            ...state,
            showInputPopup: false
        };
    }

    if (action.type === 'RESET_ATTACHMENTS') {
        return {
            ...state,
            attachments: [],
            attachmentsLinks: []
        };
    }

    if (action.type === 'ADD_ATTACHMENT') {
        const localState = {
            ...state,
            attachments: action.attachments.concat([]),
            attachmentsLinks: action.attachmentsLinks.concat([])
        };

        return Object.assign(localState, {});
    }

    if (action.type === 'DELETE_ATTACHMENT') {
        const localState = {
            ...state,
            attachments: action.attachments.concat([]),
            attachmentsLinks: action.attachmentsLinks.concat([])
        };

        return Object.assign(localState, {});
    }

    return state;
}
