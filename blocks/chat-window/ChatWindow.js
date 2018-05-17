'use strict';

/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showProfile, showWarning } from '../../actions/modals';
import {
    hideEmoji,
    addAttachments,
    hideInputPopup,
    showAttachmentPreloader } from '../../actions/activeChat';

import Chat from '../../models/Chat';

import FullSize from '../modals/full-size-attachment/FullSize';
import Warning from '../modals/warning/Warning';

import Input from './input-form/Input';
import Message from './message/Message';
import Preview from './preview-panel/Preview';
import Preloader from './preview-panel/Preloader';

import './ChatWindow.css';

class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggable: false
        };
    }

    componentDidMount = () => {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.hidePopups();
            }
        });
    }

    hidePopups = () => {
        this.props.hideEmoji();
        this.props.hideInputPopup();
    }

    /* eslint-disable max-statements */
    // проверим файлы на пригодность
    checkFiles = files => {
        const isTypeWarning = [...files].some(file => !file.type.startsWith('image'));
        const isSizeWarning = [...files].some(file => file.size >= 5242880);
        const isMaxCountWarning = this.props.attachments.length + files.length;

        if (isTypeWarning) {
            const text = 'Один или несколько файлов ' +
            'не доступны для загрузки в указанном формате. ' +
            'Попробуйте загрузить другой файл.';

            this.props.showWarning(text);

            return false;
        } else if (isSizeWarning) {
            const text = 'Размер одного или нескольких файлов ' +
            'превышает 5МБ. Попробуйте загрузить файл меньшего размера.';

            this.props.showWarning(text);

            return false;
        } else if (isMaxCountWarning > 5) {
            const text = 'Вы не можете прикрепить больше 5 вложений.';

            this.props.showWarning(text);
        }

        return true;
    }
    /* eslint-enable max-statements */

    // обработка переносимого файла
    toggleDragOver = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    // управление отображением области дропа
    toggleDragEnter = e => {
        e.preventDefault();
        this.setState({ isDraggable: true });
    };

    toggleDragLeave = e => {
        e.preventDefault();
        this.setState({ isDraggable: false });
    };

    // обработка дропа
    toggleDrop = async e => {
        e.preventDefault();
        const { files } = e.dataTransfer;

        this.setState({ isDraggable: false });
        this.props.showAttachmentPreloader(true);
        const allOK = this.checkFiles(files);

        if (allOK) {
            const filesToUpload = [...files];

            filesToUpload.splice(5 - this.props.attachments.length);
            await this.props.addAttachments(filesToUpload);
        }
        this.props.showAttachmentPreloader(false);
    };

    showProfile = profile => {
        this.props.showProfile(profile);
    };

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView();
        }
    };

    activeChatId = '0';
    messagesCount = 0;
    componentDidUpdate() {
        const { activeChat } = this.props;

        if (!activeChat) {
            return;
        }

        if (activeChat._id !== this.activeChatId) {
            this.scrollToBottom();
            this.activeChatId = activeChat._id;
            this.messagesCount = activeChat.messages.length;
        } else if (activeChat.messages.length !== this.messagesCount) {
            this.scrollToBottom();
            this.messagesCount = activeChat.messages.length;
        }
    }

    /* eslint-disable complexity */
    /* eslint-disable no-nested-ternary */
    render() {
        const { activeChat, user, attachments, forwardMessage, replyMessage } = this.props;

        if (!activeChat) {
            return (
                <section className="chat-window">
                    <img src="/static/main-label-bw.svg" className="chat-window__stub" />
                </section>
            );
        }

        const chat = new Chat(activeChat);
        const avatar = chat.getAvatarFor(user);
        const title = chat.getTitleFor(user);

        const isForward = Boolean(forwardMessage || replyMessage);
        const isImages = Boolean(attachments.length);

        return (
            <React.Fragment>
                <section
                    className="chat-window"
                    onDragOver={this.toggleDragOver}
                    onDragEnter={this.toggleDragEnter}
                    onDragLeave={this.toggleDragLeave}
                    onDrop={this.toggleDrop}
                    >
                    <div className="chat-header grid_1_2" onClick={this.hidePopups}>
                        <img
                            className="chat-header__img"
                            alt="chatavatar"
                            src={`${avatar}`}
                            title="Посмотреть информацию"
                            onClick={() => this.showProfile(activeChat)}
                            draggable="false"
                        />
                        <span
                            className="chat-header__name"
                            title={title}
                            onClick={() => this.showProfile(activeChat)}
                            >
                            {title}
                        </span>
                    </div>
                    {this.state.isDraggable
                        ?
                            <div className="chat-window__dragndrop-hint">
                                Перетащите ваши файлы сюда
                            </div>
                        :
                        (
                            <div
                                className={
                                    'messages grid_' +
                                    `${isImages
                                        ?
                                        isForward
                                            ?
                                            '2_3'
                                            :
                                            '2_4'
                                        :
                                        isForward
                                            ?
                                            '2_5'
                                            :
                                            '2_6'}`
                                }
                                onClick={this.hidePopups}>
                                {activeChat.messages.map(message => (
                                    <Message
                                        key={message._id || '0'}
                                        message={message}
                                        user={user}
                                        activeChat={activeChat}
                                        showEmojiToMsg={false}
                                    />
                                ))}
                                <div ref={el => { this.messagesEnd = el; }}></div>
                            </div>
                        )
                    }
                    <Preloader isForward={isForward} />
                    <Preview isForward={isForward} />
                    <Input
                        activeChat={this.props.activeChat}
                        checkFiles={this.checkFiles}
                        isForward={isForward}
                    />
                    {
                        isForward
                            ?
                            (
                                <div className="current-forward grid_6_7">
                                    <div className="current-forward__author">
                                        {forwardMessage
                                            ?
                                            forwardMessage.forwardFrom
                                            :
                                            replyMessage.author
                                        }:
                                    </div>
                                    <div className="current-forward__text">
                                        пересланное сообщение
                                    </div>
                                </div>
                            )
                            :
                            null
                    }
                </section>
                <FullSize />
                <Warning />
            </React.Fragment>
        );
    }
}

ChatWindow.propTypes = {
    user: PropTypes.object,
    activeChat: PropTypes.object,
    forwardMessage: PropTypes.object,
    replyMessage: PropTypes.object,

    showProfile: PropTypes.func,
    attachments: PropTypes.array,
    addAttachments: PropTypes.func,
    hideInputPopup: PropTypes.func,
    hideEmoji: PropTypes.func,
    showAttachmentPreloader: PropTypes.func,
    showWarning: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        activeChat: state.chats.find(c => state.activeChat && c._id === state.activeChat.id),
        attachments: state.activeChat && state.activeChat.attachments,
        forwardMessage: state.activeChat && state.activeChat.forwardMessage,
        replyMessage: state.activeChat && state.activeChat.replyMessage
    }), {
        showProfile,
        addAttachments,
        hideInputPopup,
        hideEmoji,
        showAttachmentPreloader,
        showWarning
    }
)(ChatWindow);
