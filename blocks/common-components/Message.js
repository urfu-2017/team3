'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';

import './Message.css';

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

            return chunk;
        });
    }

    prettyDate(date) {
        const today = new Date();
        const chatDate = new Date(date);

        if (today.getDate() === chatDate.getDate()) {
            return `${chatDate.getHours()}:${chatDate.getMinutes()}`;
        }

        return '10:20';
    }

    render() {
        const { message, user, title } = this.props;
        const { text, author, date, meta } = message;
        /* eslint-disable react/jsx-closing-tag-location */
        const metadata = Object.keys(meta).length === 0 ? <React.Fragment /> :
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
        if (user.id === author) {
            return (
                <div className="message my">
                    <span className="message__sender">{user.nickname}</span>
                    <span
                        className="message__content"
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                    <span className="message__date">{this.prettyDate(date)}</span>
                    {metadata}
                </div>
            );
        }
        // Если сообщение собеседника

        return (
            <React.Fragment>
                <div className="message friend">
                    <span className="message__sender">{title}</span>
                    {newText}
                    {/* <span dangerouslySetInnerHTML={{
                        __html: Emoji({
                            html: true,
                            set: 'emojione',
                            emoji: 'santa',
                            size: 16
                        })
                    }}
                    /> */}
                    <span className="message__date">{this.prettyDate(date)}</span>
                    {metadata}
                </div>
            </React.Fragment>
        );
    }
}

Message.propTypes = { message: PropTypes.object, user: PropTypes.object, title: PropTypes.string };
