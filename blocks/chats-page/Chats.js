'use strict';

import React from 'react';

import ChatIcon from '../common-components/ChatIcon';

export default function Chats({ chatsList, click }) {
    return chatsList.map(chat => (
        <ChatIcon class="chaticon" key={chat.id} chatProps={chat} click={click} />
    ));
}
