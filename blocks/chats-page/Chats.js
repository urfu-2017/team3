'use strict';

import React from 'react';

import ChatIcon from '../common-components/ChatIcon';

import './Chats.css';

export default function Chats({ chatsList, click }) {
    return chatsList.map(chat => (
        <ChatIcon key={chat.id} chatProps={chat} click={click} />
    ));
}
