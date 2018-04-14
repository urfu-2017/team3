'use strict';

import React from 'react';

import ChatIcon from '../common-components/ChatIcon';

import './Chats.css';

export default function Chats({ chatsList, click }) {
    if (!chatsList) {
        chatsList = [
            {
                id: 1,
                name: 'first'
            },
            {
                id: 2,
                name: 'first'
            }
        ];
    }

    return chatsList.map(chat => (
        <ChatIcon key={chat.id} chatProps={chat} click={click} />
    ));
}
