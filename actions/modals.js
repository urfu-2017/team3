'use strict';

import Chat from '../models/Chat';

import types from './types';

export const searchUsers = substring => async dispatch => {
    dispatch({ type: types.SHOW_LOADER });
    const response = await fetch(`/api/search/users/${substring}`, {
        credentials: 'include'
    });

    if (response.status === 200) {
        const users = await response.json();

        dispatch({
            type: types.FOUND_USERS,
            foundUsers: users.sort((a, b) => a.nickname.localeCompare(b.nickname))
        });
    } else {
        dispatch({ type: types.FOUND_USERS, foundUsers: [] });
    }

    dispatch({ type: types.HIDE_LOADER });
};

export const clearFoundUsers = () => dispatch => {
    dispatch({ type: types.CLEAR_FOUND_USERS });
};

export const showAddUser = () => dispatch => {
    dispatch({ type: types.SHOW_ADDUSER });
};

export const hideAddUser = () => dispatch => {
    dispatch({ type: types.HIDE_ADDUSER });
    dispatch(clearFoundUsers());
};

export const showCreateGroup = () => (dispatch, getState) => {
    const { chats, user } = getState();

    const availableUsers = chats
        .map(chat => new Chat(chat).getContactFor(user))
        .filter(contact => contact)
        .sort((a, b) => a.nickname.localeCompare(b.nickname));

    const groupMembers = [];

    dispatch({
        type: types.SHOW_CREATEGROUP,
        availableUsers,
        groupMembers
    });
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

export const setFoundUsers = foundUsers => dispatch => {
    dispatch({ type: types.FOUND_USERS, foundUsers });
};

export const includeInNewGroup = user => dispatch => {
    dispatch({ type: types.INCLUDE_IN_NEW_GROUP, user });
};

export const excludeFromNewGroup = user => dispatch => {
    dispatch({ type: types.EXCLUDE_FROM_NEW_GROUP, user });
};
