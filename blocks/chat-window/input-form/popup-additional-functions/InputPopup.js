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

import './InputPopup.css';

class InputPopup extends Component {
    // добавляем новые файлы в превью
    onFilesChange = async e => {
        const { currentTarget: { files } } = e;

        this.props.hideInputPopup();
        this.props.showAttachmentPreloader(true);
        const allOK = this.props.checkFiles(files);

        if (allOK) {
            const spliceFiles = [...files];

            spliceFiles.splice(5);
            await this.props.addAttachments(spliceFiles);
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
                    className="chat-input__autodestroy-btn chat-input__button"
                    onClick={this.props.hideInputPopup}
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
    addAttachments: PropTypes.func,
    showAttachmentPreloader: PropTypes.func,
    checkFiles: PropTypes.func
};

export default connect(
    state => ({
        showInputPopup: state.activeChat && state.activeChat.showInputPopup
    }), {
        addAttachments,
        hideInputPopup,
        showAttachmentPreloader
    }
)(InputPopup);
