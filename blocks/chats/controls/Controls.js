import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    showCreateGroup,
    showAddUser,
    showProfile
} from '../../../actions/modals';

import './Controls.css';
import Chat from '../../../models/Chat';

/* туду переделать на поиск по сообщениям */
class Controls extends Component {
    state = { isSearchString: false }

    showSearch = () => {
        const { isSearchString } = this.state;

        if (isSearchString) {
            this.props.onHideSearchMessages();
        } else {
            this.props.onShowSearchMessages();
        }
        this.setState({ isSearchString: !isSearchString });
    }

    findUsers = async pressEvent => {
        if (pressEvent.keyCode !== 13 || pressEvent.target.value === '') {
            return;
        }

        const response = await fetch(`/api/users/${pressEvent.target.value}`, {
            credentials: 'include',
            method: 'GET'
        });

        if (response.status === 200) {
            const users = await response.json();

            this.props.onUsersFound([users]);
        }
    }

    messageSearch = e => {
        /* eslint complexity: 0 */
        /* eslint max-statements: 0 */
        if (e.which === 13 && e.target.value.trim()) {
            const { user, chats } = this.props;

            const searchMessages = [];

            // вот ОНО - регулярка поиска сообщений
            const value = e.target.value.trim();
            const regexp = new RegExp(value, 'i');

            chats.forEach(chat => {
                chat.messages.forEach(message => {
                    let whereFind = '';

                    if (message.text) {
                        whereFind = message.text;
                    } else if (message.forwardFrom) {
                        whereFind = message.forwardFrom;
                    }

                    if (whereFind.match(regexp) && value.length) {
                        // ID чата для открытия в будущем
                        message.chatId = chat._id;
                        // Если группа, то аватар сообщения и название группы
                        if (chat.type === 'group') {
                            message.avatar = chat.avatar;
                            message.group = chat.title;
                        } else { // Если личка, то аватар и ник того, с кем чат
                            const interlocator = new Chat(chat).getInterlocutorFor(user);

                            message.avatar = interlocator.avatar;
                            message.ls = interlocator.nickname;
                        }
                        searchMessages.push(message);
                    }
                });
            });

            this.props.updateSearchMessages(searchMessages);
        }
    }

    showProfile = () => {
        const { user } = this.props;

        this.props.showProfile(user);
    }

    render() {
        const { isSearchString } = this.state;

        return isSearchString
            ?
            (
                <React.Fragment>
                    <input
                        type="text"
                        className="chats__search-input"
                        onKeyPress={this.messageSearch}
                        placeholder="Поиск по сообщениям"
                        autoFocus
                    />
                    <img
                        src="/static/controls/search.svg"
                        className="control-img"
                        onClick={this.showSearch}
                        title="Поиск"
                        draggable="false"
                    />
                </React.Fragment>
            )
            :
            (
                <React.Fragment>
                    <img
                        src="/static/controls/profile.svg"
                        className="control-img"
                        onClick={this.showProfile}
                        title="Мой профиль"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/chat.svg"
                        className={
                            this.props.chats.length
                                ?
                                'control-img'
                                :
                                'control-img controls_zindex_max'
                        }
                        onClick={this.props.showAddUser}
                        title="Добавить собеседника"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/create_group_chat.svg"
                        className="control-img"
                        onClick={this.props.showCreateGroup}
                        title="Создать групповой чат"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/search.svg"
                        className="control-img"
                        onClick={this.showSearch}
                        title="Поиск"
                        draggable="false"
                    />
                </React.Fragment>
            );
    }
}

Controls.propTypes = {
    user: PropTypes.object,
    chats: PropTypes.array,
    showProfile: PropTypes.func,
    showAddUser: PropTypes.func,
    showCreateGroup: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        chats: state.chats
    }), {
        showProfile,
        showAddUser,
        showCreateGroup
    }
)(Controls);
