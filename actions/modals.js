'use strict';

import types from './types';

export const searchUsers = substring => async dispatch => {
    dispatch({ type: types.SHOW_LOADER });
    const response = await fetch(`/api/search/users/${substring}`, {
        credentials: 'include'
    });

    if (response.status === 200) {
        const users = await response.json();

        dispatch({ type: types.FOUND_USERS, foundUsers: users });
    }
    dispatch({ type: types.HIDE_LOADER });
};

export const clearFoundUsers = () => dispatch => {
    dispatch({ type: types.CLEAR_FOUND_USERS });
};

export const hideAddUser = () => dispatch => {
    dispatch({ type: types.HIDE_ADDUSER });
};

export const hideCreateGroup = () => dispatch => {
    dispatch({ type: types.HIDE_CREATEGROUP });
};

export const showProfile = profile => dispatch => {
    dispatch({ type: types.SHOW_PROFILE, profile });
};

export const hideProfile = () => dispatch => {
    dispatch({ type: types.HIDE_PROFILE });
};

export const showFullSize = e => dispatch => {
    dispatch({
        type: types.SHOW_FULL_SIZE_IMAGE,
        fullSizeImg: e.target.getAttribute('src')
    });
};

export const hideFullSize = () => dispatch => {
    dispatch({ type: types.HIDE_FULL_SIZE_IMAGE });
};

export const showWarning = text => dispatch => {
    dispatch({ type: types.SHOW_WARNING, text });
};

export const hideWarning = () => dispatch => {
    dispatch({ type: types.HIDE_WARNING });
};
