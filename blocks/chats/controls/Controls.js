import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import { connect } from 'react-redux';

import './Controls.css';

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
        if (e.which === 13) {
            const { user, chats } = this.props;

            const searchMessages = [];

            chats.forEach(chat => {
                chat.messages.forEach(message => {
                    // вот ОНО - регулярка поиска сообщений
                    const regexp = new RegExp(e.target.value.trim(), 'i');

                    if (message.text.match(regexp) && e.target.value.trim().length) {
                        // ID чата для открытия в будущем
                        message.chatId = chat._id;
                        // Если группа, то аватар сообщения и название группы
                        if (chat.type === 'group') {
                            message.avatar = chat.avatar;
                            message.group = chat.title;
                        } else { // Если личка, то аватар и ник того, с кем чат
                            chat.members.forEach(member => {
                                if (member.nickname !== user.nickname) {
                                    message.avatar = member.avatar;
                                    message.ls = member.nickname;
                                }
                            });
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

        this.props.onShowProfile(user);
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
                        onClick={this.props.onShowAddUser}
                        title="Добавить собеседника"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/create_group_chat.svg"
                        className="control-img"
                        onClick={this.props.onShowCreateGroup}
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
    onUsersFound: PropTypes.func,
    onShowProfile: PropTypes.func,
    onShowAddUser: PropTypes.func,
    onShowCreateGroup: PropTypes.func,
    updateSearchMessages: PropTypes.func,
    onShowSearchMessages: PropTypes.func,
    onHideSearchMessages: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        chats: state.chats
    }),
    dispatch => ({
        onUsersFound: users => {
            dispatch({ type: 'FOUND_USERS', foundUsers: users });
        },
        onShowProfile: profile => {
            dispatch({ type: 'SHOW_PROFILE', profile });
        },
        onShowAddUser: () => {
            dispatch({ type: 'SHOW_ADDUSER' });
        },
        onShowCreateGroup: () => {
            dispatch({ type: 'SHOW_CREATEGROUP' });
        },
        updateSearchMessages: messages => {
            dispatch({ type: 'UPDATE_SEARCHMESSAGES', messages });
        },
        onShowSearchMessages: () => {
            dispatch({ type: 'SHOW_SEARCHMESSAGES' });
        },
        onHideSearchMessages: () => {
            dispatch({ type: 'HIDE_SEARCHMESSAGES' });
        }
    })
)(Controls);
