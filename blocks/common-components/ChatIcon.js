'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Link from 'next/link';
/* eslint react/jsx-no-bind: 0 */

import './ChatIcon.css';

export default class ChatIcon extends Component {

    render() {
        const { chatProps, click } = this.props;

        return (
            <li className="chat-icon" onClick={() => click(chatProps)}>
                <img src={chatProps.avatarsrc} className="chat-icon__avatar" />
                <span className="chat-icon__name">{chatProps.name}</span>
                <span className="chat-icon__last-message">{chatProps.lastMessage}</span>
            </li>
        );
    }
}

ChatIcon.propTypes = { chatProps: PropTypes.object, click: PropTypes.func };
