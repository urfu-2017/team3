'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { searchUsers, hideAddUser, clearFoundUsers } from '../../../actions/modals';

import PureProfile from './PureProfileForList';

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-closing-bracket-location */

import './AddUser.css';

class AddUser extends Component {
    hideAddUser = () => {
        this.props.hideAddUser();
        this.props.clearFoundUsers();
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideAddUser();
                this.props.clearFoundUsers();
            }
        });
    }

    searchUsers = async e => {
        if (e.which === 13) {
            await this.props.searchUsers(e.target.value);
        }
    }

    render() {
        const { user, show, foundUsers } = this.props;

        if (!show) {
            return <div />;
        }

        return (
            <div
                className={
                    this.props.chats.length
                        ?
                        'darkness'
                        :
                        'darkness darkness_transparent'
                }
                onClick={this.hideAddUser}
                >
                <div className="adduser" onClick={e => e.stopPropagation()}>
                    <div className="adduser__input_wrapper">
                        <input
                            type="text"
                            className="adduser__input"
                            placeholder="Найти пользователя"
                            onKeyPress={this.searchUsers}
                            ref={input => { this.nameInput = input; }}
                            autoFocus
                        />
                    </div>
                    <div className="adduser__list">
                        {foundUsers
                            ?
                                <div className="adduser__found-users">
                                    { foundUsers
                                        .filter(u => u.nickname !== user.nickname)
                                        .map(foundUser => {
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
    show: PropTypes.bool,
    chats: PropTypes.array,
    searchUsers: PropTypes.func,
    hideAddUser: PropTypes.func,
    foundUsers: PropTypes.array,
    clearFoundUsers: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        chats: state.chats,
        show: state.modal.show,
        foundUsers: state.modal.foundUsers
    }),
    {
        searchUsers,
        hideAddUser,
        clearFoundUsers
    }
)(AddUser);
