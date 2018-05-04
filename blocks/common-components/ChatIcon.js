'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import moment from 'moment';

import './ChatIcon.css';

class ChatIcon extends Component {
    prettyDate(date) {
        return moment(date)
            .locale('ru')
            .fromNow();
    }

    openChat = () => {
        this.props.onOpenChat(this.props.chatProps);
    }

    getInterlocutor = chat => {
        const { user } = this.props;

        let [interlocutor] = chat.members.filter(m => m.nickname !== user.nickname);

        if (!interlocutor) {
            interlocutor = user;
        }

        return interlocutor;
    }

    getLastMessage = chat => {
        if (chat.members.length) {
            return chat.messages[chat.messages.length - 1];
        }
    }

    render() {
        const { chatProps } = this.props;

        const lastMessage = this.getLastMessage(chatProps);
        const interlocutor = this.getInterlocutor(chatProps);
        const avatar = chatProps.avatar || interlocutor.avatar;
        const title = chatProps.title || interlocutor.nickname;

        return (
            <div className="chat-icon" onClick={this.openChat}>
                <div className="chat-icon__logo-box">
                    <img className="chat-icon__logo" src={avatar} />
                </div>
                <div className="chat-icon__info-box">
                    <div className="chat-icon__upper-box">
                        <div className="chat-icon__title">{title}</div>
                        <div className="chat-icon__date">
                            {lastMessage && this.prettyDate(lastMessage.date)}
                        </div>
                    </div>
                    <div className="chat-icon__lower-box">
                        {/* ТУДУ оверфлоу не работает */}
                        <div className="chat-icon__lastmsg">{lastMessage && lastMessage.text}</div>
                    </div>
                </div>
            </div>
        );
    }
}

ChatIcon.propTypes = {
    user: PropTypes.object,
    chatProps: PropTypes.object,
    onOpenChat: PropTypes.func
};

export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onOpenChat: chat => {
            dispatch({ type: 'OPEN_CHAT', id: chat._id });
        }
    })
)(ChatIcon);
