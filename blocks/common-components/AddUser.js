'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import PureProfile from './PureProfileForList';

/* eslint-disable react/jsx-no-bind */

import './AddUser.css';

class AddUser extends Component {
    hideAddUser = () => {
        this.props.onHideAddUser();
    }

    componentDidMount() {
        // this.nameInput.focus();
    }

    searchUsers = async e => {
        if (e.which === 13) {
            // const text = e.target.value;
            // Запрашиваем список пользователей подходящих
            const response = await fetch(`/api/users/${e.target.value}`, {
                credentials: 'include',
                method: 'GET'
            });

            if (response.status === 200) {
                const users = await response.json();

                this.props.onUsersFound([users]); // ТУДУ дубликаты для нагдядности
            }
        }
    }

    createChat = username => {
        // Создаем чат по юзернейму и пушим его локально в наш массив чатов
        // fetch
        // Нам возвращается модель чата! и мы ее локально добавляем
        const chatProps = {
            id: 1,
            title: username,
            avatar: 'PHN2ZyB4bWxucz0n' +
            'aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAn' +
            'IGhlaWdodD0nMTAwJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2J' +
            'hKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgzOCw' +
            'yMTcsMjE1LDEpOyBzdHJva2U6cmdiYSgzOCwyMTcsMjE1LDEpOyBzdHJ' +
            'va2Utd2lkdGg6MC41Oyc+PHJlY3QgIHg9JzQyJyB5PScyNicgd2lkdGg9' +
            'JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzQyJyB5PSc0Micgd2lkdG' +
            'g9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzQyJyB5PSc3NCcgd2lk' +
            'dGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzI2JyB5PSc1OCcgd2l' +
            'kdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzU4JyB5PSc1OCcgd2' +
            'lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PScyNicgd' +
            '2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PScyNicgd' +
            '2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc0Micg' +
            'd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc0Micg' +
            'd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc1OCc' +
            'gd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc1OC' +
            'cgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc3N' +
            'Ccgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc3' +
            'NCcgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9nPjwvc3ZnPg==',
            members: ['14900963', '79986546'],
            lastMessage: 'Новый чат',
            date: '1447857234237'
        };

        this.props.pushChatToChats(chatProps);
        this.props.hideAddUser();
        this.props.clickToOpenChat(chatProps);
    }

    render() {
        const { user, show, foundUsers } = this.props;

        if (!show) {
            return <div />;
        }

        return (
            <div className="darkness" onClick={this.hideAddUser}>
                <div className="adduser" onClick={event => event.stopPropagation()}>
                    <input
                        type="text"
                        className="adduser__input"
                        placeholder="Найти пользователя"
                        onKeyPress={this.searchUsers}
                        ref={input => { this.nameInput = input; }}
                    />
                    <div className="adduser__list">
                        {foundUsers
                            ?
                                <div className="chats__found-users">
                                    { foundUsers.map(foundUser => {
                                        return (
                                            <PureProfile
                                                key={user.nickname}
                                                user={foundUser}
                                            />
                                        );
                                    })}
                                </div>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

AddUser.propTypes = {
    user: PropTypes.object,
    show: PropTypes.boolean,
    foundUsers: PropTypes.array,
    pushChatToChats: PropTypes.func,
    hideAddUser: PropTypes.func,
    clickToOpenChat: PropTypes.func,
    onHideAddUser: PropTypes.func,
    onUsersFound: PropTypes.func
};

export default connect(
    state => ({ user: state.user, show: state.modal.show, foundUsers: state.modal.foundUsers }),
    dispatch => ({
        onHideAddUser: () => {
            dispatch({ type: 'HIDE_ADDUSER' });
        },
        onUsersFound: users => {
            dispatch({ type: 'FOUND_USERS', foundUsers: users });
        }
    })
)(AddUser);
