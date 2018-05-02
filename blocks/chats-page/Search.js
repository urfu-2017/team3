import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import { connect } from 'react-redux';

class Search extends Component {
    findUsers = async pressEvent => {
        if (pressEvent.keyCode !== 13) {
            return;
        }

        const response = await fetch(`/api/users/${pressEvent.target.value}`, {
            credentials: 'include',
            method: 'GET'
        });

        if (response.status === 200) {
            const user = await response.json();

            this.props.onUsersFound([user, user, user]); // ТУДУ дубликаты для нагдядности
        }
    }

    showProfile = () => {
        const { user } = this.props;

        this.props.onShowProfile(user);
    }
    render() {
        return (
            <React.Fragment>
                <div className="chats__box-burger" onClick={this.showProfile}>{'I\'m'}</div>
                <input
                    type="text"
                    className="chats__search-input"
                    placeholder="Найти пользователя"
                    onKeyDown={this.findUsers}
                />
            </React.Fragment>
        );
    }
}

Search.propTypes = {
    user: PropTypes.object,
    onUsersFound: PropTypes.func,
    onShowProfile: PropTypes.func
};

export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onUsersFound: users => {
            dispatch({ type: 'FOUND_USERS', foundUsers: users });
        },
        onShowProfile: profile => {
            dispatch({ type: 'SHOW_PROFILE', profile });
        }
    })
)(Search);
