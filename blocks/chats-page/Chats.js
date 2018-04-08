'use strict';

import React from 'react';

import ChatIcon from '../common-components/ChatIcon';

export default function Chats({ chatsList }) {
    return chatsList.map(chat => (
        <ChatIcon key={chat.id} chatProps={chat} />
    ));
}
