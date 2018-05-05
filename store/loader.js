'use strict';

export default function user(state = { show: false }, action) {
    if (action.type === 'SHOW_LOADER') {
        return {
            ...state,
            show: true
        };
    }

    if (action.type === 'HIDE_LOADER') {
        return {
            ...state,
            show: false
        };
    }

    return state;
}
