'use strict';

import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';

import getSocket from '../../../pages/socket';

import { setForward, setReply, showContacts } from '../../../actions/activeChat';

import { showFullSize } from '../../../actions/modals';

import EmojiPicker from './EmojiToMessage';
import ReplyMessage from './ReplyMessage';
import ForwardMessage from './ForwardMessage';

import './Message.css';

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-bracket-location */

class Message extends Component {
    state = {};

    addEmoji = emoji => {
        const chatId = this.props.activeChat._id;
        const messageId = this.props.message._id;

        const socket = getSocket();

        socket.emit('reaction', {
            chatId,
            messageId,
            reaction: emoji.id,
            userName: this.props.user._id
        });

        this.setState({ showEmojiToMsg: false });
    };

    instantAddEmoji = e => {
        const id =
        e.target.dataset.emojiName ||
        e.target.parentElement.dataset.emojiName ||
        e.target.parentElement.parentElement.dataset.emojiName;

        this.addEmoji({ id });
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.setState({ showEmojiToMsg: false });
            }
        });

        const { message, activeChat, user } = this.props;

        if (message.selfDestructTimer && message.author !== user.nickname) {
            this.initializeSelfDestruct(message, activeChat._id);
        }
    }

    initializeSelfDestruct(message, chatId) {
        const socket = getSocket();

        socket.emit('destruct_message', {
            chatId,
            messageId: message._id,
            selfDestructTimer: message.selfDestructTimer
        });
    }

    toggleEmoji = () => {
        // e.stopPropagnation();
        const showEmojiToMsg = !this.state.showEmojiToMsg;

        this.setState({ showEmojiToMsg });
    };

    hideEmoji = () => {
        this.setState({ showEmojiToMsg: false });
    };

    setForward = () => {
        const { message, user } = this.props;

        this.props.showContacts();
        this.props.setForward(message, user);
    }

    setReply = () => {
        const { message } = this.props;

        this.props.setReply(message);
    }

    componentWillMount() {
        this.setState({ showEmojiToMsg: this.props.showEmojiToMsg });
    }

    formatToEmoji(text) {
        return text.split(/:(\+?[0-9a-z_-]+):/).map((chunk, i) => {
            if (i % 2) {
                return (
                    <Emoji
                        key={i}
                        emoji={chunk}
                        set="emojione"
                        size={20}
                    />
                );
            }

            return (
                <ReactMarkdown
                    renderers={{ root: 'span', paragraph: 'span' }}
                    key={i}
                    source={chunk}
                />
            );
        });
    }

    prettyDate(date) {
        return moment(date)
            .locale('ru')
            .format('LT');
    }

    getMessageControls = message => (
        <div className="message__controls">
            <div
                className="message__control message__add-emoji"
                title="Добавить реакцию"
                onClick={this.toggleEmoji}
            />
            {
                message.selfDestructTimer
                    ?
                    (
                        <React.Fragment>
                            <div
                                className="message__control
                                message__reply
                                disabled"
                                title="Ответить"
                            />
                            <div
                                className="message__control
                                message__forward
                                disabled"
                                title="Переслать"
                            />
                            <div className="message__live-time">
                                {message.selfDestructTimer / 1000}s
                            </div>
                        </React.Fragment>
                    )
                    :
                    (
                        <React.Fragment>
                            <div
                                className="message__control message__reply"
                                onClick={this.setReply}
                                title="Ответить"
                            />
                            <div
                                className="message__control message__forward"
                                onClick={this.setForward}
                                title="Переслать"
                            />
                        </React.Fragment>
                    )
            }
        </div>
    );

    formatting({ text, attachments, date, reactions, meta }) {
        const metadata =
            Object.keys(meta || {}).length === 0 ? (
                <React.Fragment />
            ) : (
                <a className="metadata" href={meta.url}>
                    <img src={meta.image} className="metadata__image" draggable="false" />
                    <h3 className="metadata__header">{meta.title || meta.author}</h3>
                    <span className="metadata__description">{meta.description}</span>
                </a>
            );

        const newText = this.formatToEmoji(text);

        const images = attachments.map((link, i) => {
            return (
                <img
                    className="message__attachment"
                    src={link}
                    key={i}
                    onClick={this.props.showFullSize}
                    draggable="false"
                />
            );
        });

        const goodDate = this.prettyDate(date);

        const peopleEmoji = reactions
            .filter(r => r.users.length > 0)
            .map(r => {
                const usersList = r.users.map(user => {
                    return (<span key={user}>{user}</span>);
                });

                return (
                    <div
                        className="reaction"
                        key={r.emojiName}
                        data-emoji-name={r.emojiName}
                        onClick={this.instantAddEmoji}
                        >
                        <Emoji
                            emoji={r.emojiName}
                            set="emojione"
                            size={16}
                        />
                        <span className="reaction__number-peoples">{r.users.length}</span>
                        <div className="reaction__users">{usersList}</div>
                    </div>
                );
            });

        return { newText, images, goodDate, peopleEmoji, metadata };
    }

    /* eslint-disable react/jsx-closing-tag-location */
    /* eslint-disable complexity */
    render() {
        const { message, user } = this.props;
        const { text, author, date, meta, attachments, replyTo, forwardFrom } = message;
        const { showEmojiToMsg } = this.state;

        const reactions = message.reactions || {};

        const { newText, images, goodDate, peopleEmoji, metadata } = this.formatting({
            text,
            attachments,
            date,
            reactions,
            meta
        });

        // Если сообщение свое
        if (user.id === author) {
            return (
                <React.Fragment>
                    <div className="message message_my">
                        {this.getMessageControls(message)}
                        <EmojiPicker
                            addEmoji={this.addEmoji}
                            showEmojiToMsg={showEmojiToMsg}
                            hideEmoji={this.hideEmoji}
                        />
                        {
                            forwardFrom
                                ?
                                (
                                    <ForwardMessage
                                        message={message}
                                        my={user.id === author}
                                    />
                                )
                                :
                                (
                                    <div
                                        id={`id${message._id}`}
                                        className={
                                            message.selfDestructTimer
                                                ?
                                                'message__body message__body_my message_blink'
                                                :
                                                'message__body message__body_my'}
                                        >
                                        <div className="message__data">
                                            <span className="message__sender">{author}</span>
                                            <span className="message__date">{goodDate}</span>
                                        </div>
                                        <ReplyMessage message={replyTo} />
                                        <div className="message__content">{newText}</div>
                                        <div className="message__attachments">
                                            {images}
                                        </div>
                                        {metadata}
                                    </div>
                                )
                        }
                        <div className="message__reactions">
                            <div className="message__reactions_to-left">{peopleEmoji}</div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }

        // Если сообщение собеседника
        return (
            <React.Fragment>
                <div className="message message_friend">
                    {this.getMessageControls(message)}
                    <EmojiPicker
                        addEmoji={this.addEmoji}
                        showEmojiToMsg={showEmojiToMsg}
                        hideEmoji={this.hideEmoji}
                    />
                    {
                        forwardFrom
                            ?
                            (
                                <ForwardMessage
                                    message={message}
                                    my={user.id === author}
                                />
                            )
                            :
                            (
                                <div
                                    id={`id${message._id}`}
                                    className={
                                        message.selfDestructTimer
                                            ?
                                            'message__body message__body_friend message_blink'
                                            :
                                            'message__body message__body_friend'}
                                    >
                                    <div className="message__data">
                                        <span className="message__sender">{author}</span>
                                        <span className="message__date">{goodDate}</span>
                                    </div>
                                    <ReplyMessage message={replyTo} />
                                    <div className="message__content">{newText}</div>
                                    <div className="message__attachments">
                                        {images}
                                    </div>
                                    {metadata}
                                </div>
                            )
                    }
                    <div className="message__reactions">
                        <div className="message__reactions_to-left">{peopleEmoji}</div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

Message.propTypes = {
    message: PropTypes.object,
    user: PropTypes.object,
    showEmojiToMsg: PropTypes.bool,
    activeChat: PropTypes.object,
    showFullSize: PropTypes.func,
    setForward: PropTypes.func,
    setReply: PropTypes.func,
    showContacts: PropTypes.func
};

export default connect(
    () => ({}), {
        showFullSize,
        setForward,
        setReply,
        showContacts
    }
)(Message);
