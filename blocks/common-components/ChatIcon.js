'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/jsx-no-bind */

import './ChatIcon.css';

export default class ChatIcon extends Component {

    render() {
        const { chatProps, click } = this.props;

        return (
            <li className="chat-icon" onClick={() => click(chatProps)}>
                <div className="chat-icon__a-box">
                    <img src={chatProps.avatarsrc} className="chat-icon__avatar" alt="avatar" />
                </div>
                <div className="chat-icon__i-box">
                    <span className="chat-icon__name">{chatProps.name}</span>
                    <span className="chat-icon__last-message">{chatProps.lastMessage}</span>
                </div>
            </li>
        );
    }
}

ChatIcon.propTypes = { chatProps: PropTypes.object, click: PropTypes.func };
