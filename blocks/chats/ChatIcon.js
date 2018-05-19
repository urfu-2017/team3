'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import moment from 'moment';

import Chat from '../../models/Chat';
import { openChat } from '../../actions/chats';

import './ChatIcon.css';

class ChatIcon extends Component {
    prettyDate(date) {
        return moment(date)
            .locale('ru')
            .format('LT');
    }

    openChat = () => {
        this.props.openChat(this.props.chatProps._id);
    }

    render() {
        const { chatProps, user, activeChatId } = this.props;

        const chat = new Chat(chatProps);
        const lastMessage = chat.getLastMessage();
        const avatar = chat.getAvatarFor(user);
        const title = chat.getTitleFor(user);

        let chatClassName = 'chat-icon';

        if (chatProps._id === activeChatId) {
            chatClassName = 'chat-icon chat-icon-open';
        }

        return (
            <div className={chatClassName} onClick={this.openChat}>
                <div className="chat-icon__logo-box">
                    <img className="chat-icon__logo" src={avatar} draggable="false" />
                </div>
                <div className="chat-icon__info-box">
                    <div className="chat-icon__upper-box">
                        <div className="chat-icon__title">{title}</div>
                        <div className="chat-icon__date">
                            {this.prettyDate(chat.getDate())}
                        </div>
                    </div>
                    <div className="chat-icon__lower-box">
                        {/* ТУДУ оверфлоу не работает */}
                        <div className="chat-icon__lastmsg">
                            {lastMessage && (lastMessage.text || 'Photo')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ChatIcon.propTypes = {
    user: PropTypes.object,
    chatProps: PropTypes.object,
    openChat: PropTypes.func,
    activeChatId: PropTypes.string
};

export default connect(
    state => ({
        activeChatId: state.activeChat && state.activeChat.id,
        user: state.user
    }), {
        openChat
    }
)(ChatIcon);
