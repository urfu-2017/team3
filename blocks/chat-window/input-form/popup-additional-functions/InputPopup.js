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
    showAttachmentPreloader } from '../../../../actions/activeChat';

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

    render() {
        const { showInputPopup } = this.props;

        if (!showInputPopup) {
            return <div />;
        }

        return (
            <div className="chat-input__burger-content">
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
                    onClick={this.props.hideInputPopup}
                    title="Местоположение"
                    >
                    <span className="chat-input__button_description_add">
                        Местоположение
                    </span>
                </label>
                <label
                    className="chat-input__autodestroy-btn chat-input__button"
                    title="Секретное сообщение"
                    >
                    <TimerSetting
                        submitMessage={this.props.submitMessage}
                    />
                </label>
            </div>
        );
    }
}

InputPopup.propTypes = {
    showInputPopup: PropTypes.bool,
    hideInputPopup: PropTypes.func,
    attachments: PropTypes.array,
    addAttachments: PropTypes.func,
    showAttachmentPreloader: PropTypes.func,
    checkFiles: PropTypes.func,
    submitMessage: PropTypes.func
};

export default connect(
    state => ({
        showInputPopup: state.activeChat && state.activeChat.showInputPopup,
        attachments: state.activeChat && state.activeChat.attachments
    }), {
        addAttachments,
        hideInputPopup,
        showAttachmentPreloader
    }
)(InputPopup);
