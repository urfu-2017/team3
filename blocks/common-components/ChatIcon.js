'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import moment from 'moment';

import './ChatIcon.css';

class ChatIcon extends Component {
    prettyDate(date) {
        return moment(date).fromNow();
    }

    openChat = () => {
        this.props.onOpenChat(this.props.chatProps);
    }

    render() {
        const { chatProps } = this.props;
        const avatalLink = `data:image/svg+xml;base64,${chatProps.avatar}`;
        const lastMessage = chatProps.messages.length
            ? chatProps.messages[chatProps.messages.length - 1]
            : null;

        return (
            <div className="chat-icon" onClick={this.openChat}>
                <div className="chat-icon__logo-box">
                    <img className="chat-icon__logo" src={avatalLink} />
                </div>
                <div className="chat-icon__info-box">
                    <div className="chat-icon__upper-box">
                        <div className="chat-icon__title">{chatProps.title}</div>
                        <div className="chat-icon__date">{lastMessage && this.prettyDate(lastMessage.date)}</div>
                    </div>
                    <div className="chat-icon__lower-box">
                        <div className="chat-icon__lastmsg">{lastMessage && lastMessage.text}</div>
                    </div>
                </div>
            </div>
        );
    }
}

ChatIcon.propTypes = {
    chatProps: PropTypes.object,
    onOpenChat: PropTypes.func
};

export default connect(
    () => ({}),
    dispatch => ({
        onOpenChat: chat => {
            dispatch({ type: 'OPEN_CHAT', id: chat._id });
        }
    })
)(ChatIcon);
