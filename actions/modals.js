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

export const hideAddUser = () => dispatch => {
    dispatch({ type: types.HIDE_ADDUSER });
};

export const hideCreateGroup = () => dispatch => {
    dispatch({ type: types.HIDE_CREATEGROUP });
};

export const hideProfile = () => dispatch => {
    dispatch({ type: types.HIDE_PROFILE });
};
