'use strict';

import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';
import ReactMarkdown from 'react-markdown';

import EmojiPicker from './EmojiToMessage';
import './Message.css';

/* eslint-disable react/jsx-no-bind */

export default class Message extends Component {
    addEmoji = async emoji => {
        const URL = `/api/chats/:id/messages/${this.props.message.id}/reactions`;
        const reaction = await fetch(URL, {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reaction: emoji.id
            })
        });

        if (reaction.status === 200) {
            const createdChat = await reaction.json();

            this.state.chats.push(createdChat);
        }
    }

    toggleEmoji = () => {
        const showEmojiToMsg = !this.state.showEmojiToMsg;

        this.setState({ showEmojiToMsg });
    }

    componentWillMount() {
        this.setState({ showEmojiToMsg: this.props.showEmojiToMsg });
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

    formatting({ text, attachmentIds, date, reactions, meta }) {
        const metadata = Object.keys(meta || {}).length === 0
            ?
                <React.Fragment />
            :
            (
                <a className="metadata" href={meta.url}>
                    <img
                        src={meta.image}
                        className="metadata__image"
                    />
                    <h3 className="metadata__header">{meta.title || meta.author}</h3>
                    <div className="metadata__description">{meta.description}</div>
                </a>
            );

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

        const goodDate = this.prettyDate(date);

        const emojiNames = Object.keys(reactions);
        const peopleEmoji = emojiNames.map(name => {
            return (
                <div className="reaction" key={name}>
                    <Emoji
                        key={Math.floor(Math.random() * 1000000)}
                        emoji={name}
                        set="emojione"
                        size={20}
                    />
                    <span className="reaction__number-peoples">
                        {reactions[`${name}`]}
                    </span>
                </div>
            );
        });

        return { newText, attachments, goodDate, peopleEmoji, metadata };
    }

    render() {
        const { message, user, title } = this.props;
        const { text, author, date, meta } = message;
        const { showEmojiToMsg } = this.state;
        const attachmentIds = [
            'https://pp.userapi.com/c831108/v831108414/ce2cf/TP3B77406X0.jpg'
        ];
        const reactions = {
            'santa': 2,
            'joy_cat': 1,
            'smiley': 3
        };

        /* eslint-disable react/jsx-closing-tag-location */

        const { newText, attachments, goodDate, peopleEmoji, metadata } =
            this.formatting({ text, attachmentIds, date, reactions, meta });

        // Если сообщение свое
        if (user.id !== author) {
            return (
                <div className="message my">
                    <EmojiPicker
                        addEmoji={this.addEmoji}
                        showEmojiToMsg={showEmojiToMsg}
                    />
                    <div className="message__data">
                        <span className="message__sender">{title}</span>
                        <span className="message__date">{goodDate}</span>
                    </div>
                    <div className="message__content">
                        {newText}
                    </div>
                    {attachments}
                    <div className="message__reactions">
                        <div className="message__reactions_to-left">
                            {peopleEmoji}
                        </div>
                        <img
                            src="/static/emoji.svg"
                            className="message__add-emoji"
                            onClick={this.toggleEmoji}
                        />
                    </div>
                    {metadata}
                </div>
            );
        }

        // Если сообщение собеседника
        return (
            <div className="message friend">
                <EmojiPicker
                    addEmoji={this.addEmoji}
                    showEmojiToMsg={this.state.showEmojiToMsg}
                />
                <div className="message__data">
                    <span className="message__sender">{title}</span>
                    <span className="message__date">{goodDate}</span>
                </div>
                {newText}
                {attachments}
                <div className="message__reactions">
                    <div className="message__reactions_to-left">
                        {peopleEmoji}
                    </div>
                    <img
                        src="/static/emoji.svg"
                        className="message__add-emoji"
                        onClick={this.toggleEmoji}
                    />
                </div>
                {metadata}
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.object,
    user: PropTypes.object,
    title: PropTypes.string,
    showEmojiToMsg: PropTypes.bool
};
