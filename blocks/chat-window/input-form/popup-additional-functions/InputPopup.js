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
    showTimerSetting } from '../../../../actions/activeChat';

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

    // настраиваем сообщению самоуничтожение
    onSelfDestruct = () => {
        this.props.hideInputPopup();
        this.props.showTimerSetting();
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
                    className="chat-input__autodestroy-btn chat-input__button"
                    onClick={this.onSelfDestruct}
                    title="Секретное сообщение"
                    >
                    <span className="chat-input__button_description_add">
                        Секретное сообщение
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
    showTimerSetting: PropTypes.func
};

export default connect(
    state => ({
        showInputPopup: state.activeChat && state.activeChat.showInputPopup,
        attachments: state.activeChat && state.activeChat.attachments,
        isShowTimerSetting: state.activeChat && state.activeChat.isShowTimerSetting
    }), {
        addAttachments,
        hideInputPopup,
        showAttachmentPreloader,
        showTimerSetting
    }
)(InputPopup);
