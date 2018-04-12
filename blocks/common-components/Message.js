'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Message.css';
// import Link from 'next/link';
/* eslint react/jsx-no-bind: 0 */
export default class Message extends Component {

    render() {
        const { message, user, name } = this.props;
        const { content, meta } = message;

        // Если сообщение свое
        if (user.id === meta.author) {
            return (
                <div className="message my">
                    <span className="message__sender">{user.nickname}</span>
                    <span className="message__content">{content}</span>
                </div>
            );
        }
        // Если сообщение собеседника

        return (
            <div className="message friend">
                <span className="message__sender">{name}</span>
                <span className="message__content">{content}</span>
            </div>
        );
    }
}

Message.propTypes = { message: PropTypes.object, user: PropTypes.object, name: PropTypes.string };
