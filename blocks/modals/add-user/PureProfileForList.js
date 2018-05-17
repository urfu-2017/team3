import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { createChat } from '../../../actions/chats';
import { clearFoundUsers } from '../../../actions/modals';

import './PureProfileForList.css';

class PureProfile extends Component {
    createChat = () => {
        const { myUser, user } = this.props;

        this.props.createChat(myUser, user);
        this.props.clearFoundUsers();
    };

    render() {
        const { user } = this.props;

        return (
            <div className="profile_in-list" onClick={this.createChat}>
                <div className="profile__avatar-box_in-list">
                    <img
                        className="profile__avatar_in-list"
                        src={user.avatar}
                        alt="avatar"
                        draggable="false"
                    />
                </div>
                <div className="profile__info-box_in-list">
                    <span className="profile__nickname_in-list">{user.nickname}</span>
                </div>
            </div>
        );
    }
}

PureProfile.propTypes = {
    user: PropTypes.object,
    myUser: PropTypes.object,
    createChat: PropTypes.func,
    clearFoundUsers: PropTypes.func
};

export default connect(
    state => ({
        myUser: state.user
    }), {
        createChat,
        clearFoundUsers
    }
)(PureProfile);
