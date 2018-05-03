'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';
import ReactMarkdown from 'react-markdown';

import './Message.css';

import moment from 'moment';

/* eslint-disable react/jsx-no-bind */

export default class Message extends Component {
    formatToEmoji(text) {
        return text.split(/:([0-9a-z_-]+):/).map((chunk, i) => {
            if (i % 2) {
                return (
                    <Emoji
                        key={Math.floor(Math.random() * 1000000)}
                        emoji={chunk}
                        set="emojione"
                        size={16}
                    />
                );
            }

            return (
                <ReactMarkdown
                    renderers={{ root: 'span', paragraph: 'span' }}
                    key={Math.floor(Math.random() * 1000000)}
                    source={chunk}
                />
            );
        });
    }

    prettyDate(date) {
        return moment(date)
            .locale('ru')
            .fromNow();
    }

    render() {
        const { message, user, title } = this.props;
        const { text, author, date, meta } = message;
        /* eslint-disable react/jsx-closing-tag-location */
        const metadata = Object.keys(meta || {}).length === 0 ? <React.Fragment /> :
            (<a className="metadata" href={meta.url}>
                <img
                    src={meta.image}
                    className="metadata__image"
                />
                <h3 className="metadata__header">{meta.title || meta.author}</h3>
                <div className="metadata__description">{meta.description}</div>
            </a>);
        const newText = this.formatToEmoji(text);

        // Если сообщение свое
        if (user.id !== author) {
            return (
                <div className="message my">
                    <span className="message__sender">{user.nickname}</span>
                    {newText}
                    <span className="message__date">{this.prettyDate(date)}</span>
                    {metadata}
                </div>
            );
        }
        // Если сообщение собеседника

        return (
            <div className="message friend">
                <span className="message__sender">{title}</span>
                {newText}
                <span className="message__date">{this.prettyDate(date)}</span>
                {metadata}
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.object,
    user: PropTypes.object,
    title: PropTypes.string
};
