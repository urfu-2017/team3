'use strict';

import types from './types';

export const addAttachments = files => async dispatch => {
    const attachments = await Promise.all([...files].map(async file => {
        const formData = new FormData();

        formData.append('image', file);
        const response = await fetch('/api/attachments', {
            credentials: 'include',
            method: 'PUT',
            body: formData
        });

        if (response.status === 200) {
            const answer = await response.json();
            const { url } = answer;

            return { file, url };
        }

        return { file, url: 'http://fotki.ykt.ru/albums/userpics/15649/moeya.jpg' };
    }));

    dispatch({ type: types.ADD_ATTACHMENTS, attachments });
};

export const deleteAttachment = index => dispatch => {
    dispatch({ type: types.DELETE_ATTACHMENT, index });
};

export const hideInputPopup = () => dispatch => {
    dispatch({ type: types.HIDE_INPUT_POPUP });
};
