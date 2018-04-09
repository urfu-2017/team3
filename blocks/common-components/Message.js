'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Message.css';
// import Link from 'next/link';
/* eslint react/jsx-no-bind: 0 */
export default class Message extends Component {

    render() {
        const { message } = this.props;
        const { text, userid } = message;

        return (
            <div className="message">
                <p>{userid}</p>
                <p>{text}</p>
            </div>
        );
    }
}

Message.propTypes = { message: PropTypes.object };
