'use strict';

import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';
import ReactMarkdown from 'react-markdown';

import EmojiPicker from '../chats-page/Emoji';
import './Message.css';

/* eslint-disable react/jsx-no-bind */

export default class Message extends Component {
    addEmoji = emoji => {
        console.log(emoji);
    }

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
        // console.log(this.props);
        const { message, user, toggleEmoji } = this.props;
        const { text, author, date, meta } = message;
        const attachmentIds = [
            // 'https://pp.userapi.com/c824701/v824701649/8aa2f/PfeZSgjvF2E.jpg',
            // 'https://pp.userapi.com/c831108/v831108414/ce2cf/TP3B77406X0.jpg',
            // 'https://pp.userapi.com/c636020/v636020006/2290b/FvHKIbC-iQk.jpg',
            // 'https://pp.userapi.com/c636020/v636020006/2290b/FvHKIbC-iQk.jpg'
        ];
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
        const attachments = attachmentIds.map(link => {
            return (
                <img
                    className="message__attachment"
                    src={link}
                    key={Math.floor(Math.random() * 10000000)}
                />
            );
        });

        // Если сообщение свое
        if (user.id !== author) {
            return (
                <div className="message my">
                    <EmojiPicker addEmoji={this.addEmoji} />
                    <span className="message__sender">{author}</span>
                    {newText}
                    {attachments}
                    <span className="message__date">{this.prettyDate(date)}</span>
                    <img
                        src="/static/emoji.svg"
                        className="message__add-emoji"
                        onClick={toggleEmoji}
                    />
                    {metadata}
                </div>
            );
        }

        // Если сообщение собеседника
        return (
            <div className="message friend">
                <EmojiPicker addEmoji={this.addEmoji} />
                <span className="message__sender">{author}</span>
                {newText}
                {attachments}
                <span className="message__date">{this.prettyDate(date)}</span>
                <img
                    src="/static/emoji.svg"
                    className="message__add-emoji"
                    onClick={toggleEmoji}
                />
                {metadata}
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.object,
    user: PropTypes.object,
    title: PropTypes.string,
    toggleEmoji: PropTypes.func
};
