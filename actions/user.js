'use strict';
/* eslint-disable import/prefer-default-export */

import types from './types';

export const changeAvatar = (file, user) => async dispatch => {
    dispatch({ type: types.SHOW_LOADER });

    const formData = new FormData();

    formData.append('userAvatar', file);

    const response = await fetch(`/api/users/${user.nickname}/avatar`, {
        credentials: 'include',
        method: 'PATCH',
        body: formData
    });

    if (response.status === 200) {
        const answer = await response.json();

        dispatch({ type: types.CHANGE_AVATAR, avatar: answer.url });
    }

    dispatch({ type: types.HIDE_LOADER });
};
