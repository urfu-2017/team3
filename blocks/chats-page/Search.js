import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';

export default class Search extends Component {
    findUser = async pressEvent => {
        if (pressEvent.keyCode !== 13) {
            return;
        }

        const response = await fetch(`/api/users/${pressEvent.target.value}`, {
            credentials: 'include',
            method: 'GET'
        });

        if (response.status === 200) {
            const user = await response.json();

            this.props.findUsers([user]);
        }
    }

    render() {
        const { user } = this.props;

        return (
            <React.Fragment>
                <div className="chats__box-burger" onClick={() => this.props.showProfile(user)}>a</div>
                <input
                    type="text"
                    className="chats__search-input"
                    placeholder="Найти пользователя"
                    onKeyDown={this.findUser}
                />
            </React.Fragment>
        );
    }
}

Search.propTypes = {
    user: PropTypes.object,
    showProfile: PropTypes.func,
    findUsers: PropTypes.func
};
