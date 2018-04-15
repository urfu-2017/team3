'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Message.css';

/* eslint-disable react/jsx-no-bind */

export default class Message extends Component {

    render() {
        const { message, user, title } = this.props;
        const { content, author, meta } = message;
        console.log(content, meta);

        // Если сообщение свое
        if (user.id === author) {
            return (
                <div className="message my">
                    <span className="message__sender">{user.nickname}</span>
                    <span
                        className="message__content"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                    <a className="metadata" href={meta.url}>
                        <img
                            src={meta.image}
                            className="metadata__image"
                        />
                        <h3 className="metadata__header">{meta.title || meta.author}</h3>
                        <div className="metadata__description">{meta.description}</div>
                        {/* {Object.keys(meta)} */}
                    </a>
                </div>
            );
        }
        // Если сообщение собеседника

        return (
            <React.Fragment>
                <div className="message friend">
                    <span className="message__sender">{title}</span>
                    <span
                        className="message__content"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                    <a className="metadata" href={meta.url}>
                        <img
                            src={meta.image}
                            className="metadata__image"
                        />
                        <h3 className="metadata__header">{meta.title || meta.author}</h3>
                        <div className="metadata__description">{meta.description}</div>
                        {/* {Object.keys(meta)} */}
                    </a>
                </div>
            </React.Fragment>
        );
    }
}

Message.propTypes = { message: PropTypes.object, user: PropTypes.object, title: PropTypes.string };
