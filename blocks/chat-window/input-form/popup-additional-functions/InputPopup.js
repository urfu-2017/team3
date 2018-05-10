/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addAttachments, hideInputPopup } from '../../../../actions/activeChat';

import './InputPopup.css';

class InputPopup extends Component {
    // добавляем новые файлы в превью
    onFilesChange = async e => {
        const { currentTarget: { files } } = e;

        await this.props.addAttachments(files);
    }

    render() {
        const { showInputPopup } = this.props;

        if (!showInputPopup) {
            return <div />;
        }

        return (
            <div className="chat-input__burger-content">
                <label className="chat-input__attachment-btn chat-input__button">
                    <input
                        type="file"
                        className="chat-input__input_not-visual"
                        multiple
                        onChange={this.onFilesChange}
                    />
                    <span className="chat-input__button_description_add">
                        Прикрепить файл
                    </span>
                </label>
                <label
                    className="chat-input__autodestroy-btn chat-input__button"
                    onClick={this.props.hideInputPopup}
                    >
                    <span className="chat-input__button_description_add">
                        Секретное сообщение
                    </span>
                </label>
                <label
                    className="chat-input__geolocation-btn chat-input__button"
                    onClick={this.props.hideInputPopup}
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
    addAttachments: PropTypes.func
};

export default connect(
    state => ({
        showInputPopup: state.activeChat && state.activeChat.showInputPopup
    }), {
        addAttachments,
        hideInputPopup
    }
)(InputPopup);
