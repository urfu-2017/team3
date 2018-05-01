'use strict';

import React from 'react';
import { connect } from 'react-redux';

import ChatIcon from '../common-components/ChatIcon';

import './Chats.css';

class Chats extends React.Component {
    render() {
        const { chats, onChatClick } = this.props;

        return chats.map(chat => (
            <ChatIcon key={chat.id} chatProps={chat} clickToOpenChat={onChatClick} />
        ));
    }
}

export default connect(
    state => ({
        chats: state.chats
    }),
    dispatch => ({
        onChatClick: chat => {
            dispatch({ type: 'OPEN_CHAT', chat });
        }
    })
)(Chats);
