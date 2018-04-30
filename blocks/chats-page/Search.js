import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Search extends Component {

    render() {
        const { user } = this.props;

        return (
            <React.Fragment>
                <div className="chats__box-burger" onClick={() => this.props.showProfile(user)}>a</div>
                <input
                    type="text"
                    className="chats__search-input"
                    placeholder="Найти пользователя"
                />
            </React.Fragment>
        );
    }
}

Search.propTypes = {
    user: PropTypes.object,
    showProfile: PropTypes.func
};
