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
            const response = await fetch(`/api/search/users/${e.target.value}`, {
                credentials: 'include'
            });

            if (response.status === 200) {
                const users = await response.json();

                this.props.onUsersFound(users);
            }
        }
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
