/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    addAttachments,
    hideInputPopup,
    showAttachmentPreloader,
    sendMessage } from '../../../../actions/activeChat';

import TimerSetting from './timer/TimerSetting';

import './InputPopup.css';

class InputPopup extends Component {
    // добавляем новые файлы в превью
    onFilesChange = async e => {
        const { currentTarget: { files } } = e;

        this.props.hideInputPopup();
        this.props.showAttachmentPreloader(true);
        const allOK = this.props.checkFiles(files);

        if (allOK) {
            const filesToUpload = [...files];

            filesToUpload.splice(5 - this.props.attachments.length);
            await this.props.addAttachments(filesToUpload);
        }
        this.props.showAttachmentPreloader(false);
    }

    sendLocation = () => {
        if ('geolocation' in navigator) {
            const { chatId, author } = this.props;

            // туду: показать сообщение 'Пытаемся вас найти'
            navigator.geolocation.getCurrentPosition(position => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                // туду: скрыть сообщение

                this.props.sendMessage(chatId, {
                    author,
                    location,
                    text: ''
                });
            });
        } else {
            // туду: показать сообщение 'Навигация не доступна'
        }

        this.props.hideInputPopup();
    }

    render() {
        const { showInputPopup } = this.props;

        if (!showInputPopup) {
            return null;
        }

        return (
            <div className={'chat-input__burger-content ' +
            `${this.props.activeChat.type === 'private'
                ?
                'chat-input__burger-content_private'
                :
                'chat-input__burger-content_group'}`}
                >
                <label
                    className="chat-input__attachment-btn chat-input__button"
                    title="Загрузить изображение"
                    >
                    <input
                        type="file"
                        className="chat-input__input_not-visual"
                        multiple
                        onChange={this.onFilesChange}
                    />
                    <span className="chat-input__button_description_add">
                        Загрузить изображение
                    </span>
                </label>
                <label
                    className="chat-input__geolocation-btn chat-input__button"
                    onClick={this.sendLocation}
                    title="Местоположение"
                    >
                    <span className="chat-input__button_description_add">
                        Местоположение
                    </span>
                </label>
                {
                    this.props.activeChat.type === 'private'
                        ?
                        (
                            <label
                                className="chat-input__autodestroy-btn chat-input__button"
                                title="Секретное сообщение"
                                >
                                <TimerSetting
                                    submitMessage={this.props.submitMessage}
                                />
                            </label>
                        )
                        :
                        null
                }
            </div>
        );
    }
}

InputPopup.propTypes = {
    activeChat: PropTypes.object,
    showInputPopup: PropTypes.bool,
    hideInputPopup: PropTypes.func,
    attachments: PropTypes.array,
    addAttachments: PropTypes.func,
    showAttachmentPreloader: PropTypes.func,
    checkFiles: PropTypes.func,
    submitMessage: PropTypes.func,
    sendMessage: PropTypes.func,
    chatId: PropTypes.string,
    author: PropTypes.string
};

export default connect(
    state => ({
        chatId: state.activeChat.id,
        author: state.user.nickname,
        showInputPopup: state.activeChat && state.activeChat.showInputPopup,
        attachments: state.activeChat && state.activeChat.attachments
    }), {
        addAttachments,
        hideInputPopup,
        showAttachmentPreloader,
        sendMessage
    }
)(InputPopup);
