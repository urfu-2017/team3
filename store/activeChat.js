'use strict';

/* eslint-disable complexity */
/* eslint-disable max-statements */
export default function activeChat(state = null, action) {
    if (action.type === 'OPEN_CHAT') {
        return {
            id: action.id,
            attachments: [],
            forwardMessage: state && state.forwardMessage
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
            forwardMessage: action.forwardMessage
        };
    }

    return state;
}
