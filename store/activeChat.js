'use strict';

/* eslint-disable complexity */
/* eslint-disable max-statements */
export default function activeChat(state = null, action) {
    if (action.type === 'OPEN_CHAT') {
        return {
            id: action.id,
            attachments: [],
            forwardMessage: state && state.forwardMessage,
            selfDestructTimer: null
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

    if (action.type === 'ADD_ATTACHMENTS') {
        return {
            ...state,
            attachments: [...state.attachments, ...action.attachments]
        };
    }

    if (action.type === 'DELETE_ATTACHMENT') {
        return {
            ...state,
            attachments: state.attachments.filter((a, i) => i !== action.index)
        };
    }

    if (action.type === 'ATTACHMENTS_UPLOADING') {
        return {
            ...state,
            isShowAttachmentPreloader: action.isUploading
        };
    }

    if (action.type === 'SET_FORWARD') {
        return {
            ...state,
            forwardMessage: action.forwardMessage,
            replyMessage: null
        };
    }

    if (action.type === 'DELETE_FORWARD') {
        return {
            ...state,
            forwardMessage: null
        };
    }

    if (action.type === 'SET_REPLY') {
        return {
            ...state,
            replyMessage: action.replyMessage,
            forwardMessage: null
        };
    }

    if (action.type === 'DELETE_REPLY') {
        return {
            ...state,
            replyMessage: null
        };
    }

    if (action.type === 'SET_SELF_DESTRUCT') {
        return {
            ...state,
            selfDestructTimer: action.timer
        };
    }

    if (action.type === 'RESET_SELF_DESTRUCT') {
        return {
            ...state,
            selfDestructTimer: null
        };
    }

    if (action.type === 'SHOW_CONTACTS_TO_FORWARD') {
        return {
            ...state,
            isShowContacts: true
        };
    }

    if (action.type === 'HIDE_CONTACTS_TO_FORWARD') {
        return {
            ...state,
            isShowContacts: false
        };
    }

    return state;
}
