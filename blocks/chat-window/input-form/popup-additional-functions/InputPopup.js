/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class InputPopup extends Component {
    // добавляем новые файлы в превью
    onFilesChange = async e => {
        const attachments = this.props.attachments || [];
        const links = this.props.attachmentsLinks || [];

        const { currentTarget: { files } } = e;

        const linksQueue = {};

        await Promise.all([...files].map(async (file, i) => {
            const formData = new FormData();

            formData.append('image', file);
            const response = await fetch('/api/attachments', {
                credentials: 'include',
                method: 'PUT',
                body: formData
            });

            if (response.status === 200) {
                const answer = await response.json();
                const { url } = answer;

                linksQueue[`${i}`] = url;

                return url;
            }

            return 'http://fotki.ykt.ru/albums/userpics/15649/moeya.jpg';
        }));

        Object.keys(linksQueue).forEach(index => {
            links.push(linksQueue[`${index}`]);
        });

        [...files].forEach(file => {
            attachments.push(file);
        });
        await this.props.togglePreview(attachments);
        await this.props.addAttachment(attachments, links);
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
                <label className="chat-input__autodestroy-btn chat-input__button">
                    <span className="chat-input__button_description_add">
                        Секретное сообщение
                    </span>
                </label>
                <label className="chat-input__geolocation-btn chat-input__button">
                    <span className="chat-input__button_description_add">
                        Местоположение
                    </span>
                </label>
            </div>
        );
    }
}

InputPopup.propTypes = {
    attachments: PropTypes.array,
    attachmentsLinks: PropTypes.array,
    togglePreview: PropTypes.func,
    addAttachment: PropTypes.func,
    showInputPopup: PropTypes.bool
};

export default connect(
    state => ({
        showInputPopup: state.activeChat && state.activeChat.showInputPopup,
        attachments: state.activeChat.attachments,
        attachmentsLinks: state.activeChat.attachmentsLinks
    }),
    dispatch => ({
        addAttachment: (attachments, attachmentsLinks) => {
            dispatch({ type: 'ADD_ATTACHMENT', attachments, attachmentsLinks });
        }
    })
)(InputPopup);
