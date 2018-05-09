/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import getSocket from '../../pages/socket';

class Input extends Component {

    // при вводе добавляем с state
    changeText = e => this.setState({ msgText: e.target.value });

    // добавляем новые файлы в превью
    onFilesChange = async e => {
        const attachments = this.state.attachments || [];

        const { currentTarget: { files } } = e;

        const links = [];

        await Promise.all([...files].map(async file => {
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

                links.push(url);

                return url;
            }

            return 'http://fotki.ykt.ru/albums/userpics/15649/moeya.jpg';
        }));

        if (attachments.length) {
            await this.setState({
                attachmentsLinks: this.state.attachmentsLinks.concat(links)
            });
        } else {
            await this.setState({
                attachmentsLinks: links
            });
        }
        [...files].forEach(file => {
            attachments.push(file);
        });
        await this.setState({ attachments });
        await this.togglePreview(attachments);
    }

    // клик на рожицу, используется в <Emoji.../>
    toggleEmoji = () => {
        if (this.props.showEmoji) {
            this.props.onHideEmoji();
        } else {
            this.props.onShowEmoji();
        }
    }

    submitMessage = async () => {
        if (this.state.msgText.trim() || this.state.attachments.length) {
            this.setState({
                attachments: [],
                attachmentsLinks: [],
                msgText: ''
            });
            this.togglePreview([]);
            const input = document.querySelector('.chat-input__write-field');
            const text = input.value;

            input.value = '';
            const socket = getSocket();

            await socket.emit('message', {
                message: {
                    text,
                    author: this.props.user.nickname,
                    attachments: this.state.attachmentsLinks || []
                },
                chatId: this.props.activeChat._id
            }, async data => {
                await this.props.onReceiveMessage(data);
                await this.scrollToBottom();
            });

            this.props.onSortChats(this.props.activeChat._id);
        }
    }

    // прослушка отправки на Enter
    keySubmitMessage = e => {
        if (e.keyCode === 13) {
            this.submitMessage();
            e.target.value = '';
        }
    }

    render() {
        return (
            <div className="chat-input" onClick={this.props.onHideEmoji}>
                <input
                    onChange={this.changeText}
                    onKeyDown={this.keySubmitMessage}
                    type="text"
                    className="chat-input__write-field"
                />
                <label
                    className="chat-input__audioinput-btn chat-input__button"
                    >
                </label>
                <label
                    className="chat-input__emoji-btn chat-input__button"
                    onClick={event => event.stopPropagation()}
                    >
                    <input
                        type="button"
                        onClick={this.toggleEmoji}
                        className="chat-input__input_not-visual"
                    />
                </label>
                <input
                    type="checkbox"
                    className="chat-input__input_not-visual"
                    id="chat-input__burger-checkbox"
                />
                <label
                    className="chat-input__burger-btn chat-input__button"
                    htmlFor="chat-input__burger-checkbox"
                    >
                </label>
                <label
                    src="/static/send_message.svg"
                    onClick={this.submitMessage}
                    className="chat-input__send-btn chat-input__button"
                />
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
            </div>
        );
    }
}

Input.propTypes = {
    user: PropTypes.object,
    onShowEmoji: PropTypes.func,
    onReceiveMessage: PropTypes.func,
    showEmoji: PropTypes.bool,
    onHideEmoji: PropTypes.func,
    activeChat: PropTypes.object,
    onSortChats: PropTypes.func
};

export default connect(
    state => ({
        chats: state.chats
    })
)(Input);
