import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { createChat } from '../../../actions/chats';

class PureProfile extends Component {
    createChat = () => {
        const { myUser, user } = this.props;

        this.props.createChat(myUser, user);
    };

    render() {
        const { user } = this.props;

        return (
            <div className="profile" onClick={this.createChat}>
                <div className="profile__avatar-box">
                    <img
                        className="profile__avatar"
                        src={user.avatar}
                        alt="avatar"
                    />
                </div>
                <div className="profile__info-box">
                    <span className="profile__nickname">{user.nickname}</span>
                </div>
            </div>
        );
    }
}

PureProfile.propTypes = {
    user: PropTypes.object,
    myUser: PropTypes.object,
    createChat: PropTypes.func
};

export default connect(
    state => ({
        myUser: state.user
    }), {
        createChat
    }
)(PureProfile);
