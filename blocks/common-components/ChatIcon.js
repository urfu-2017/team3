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
                {chatProps.title}
            </li>
        );
    }
}

ChatIcon.propTypes = { chatProps: PropTypes.object, click: PropTypes.func };
