import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

class PureProfile extends Component {
    createChat = async () => {
        const { user, myUser } = this.props;
        const response = await fetch('api/chats/', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                members: [user.nickname, myUser.nickname],
                type: 'private'
            })
        });

        if (response.status === 200) {
            const createdChat = await response.json();

            this.props.onCreateChat(createdChat);
        }
    }

    render() {
        const { user } = this.props;

        return (
            <div className="profile" onClick={this.createChat}>
                <div className="profile__avatar-box">
                    <img
                        className="profile__avatar"
                        src={`data:image/svg+xml;base64,${user.avatar}`}
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
    onCreateChat: PropTypes.func
};

export default connect(
    state => ({
        myUser: state.user
    }),
    dispatch => ({
        onCreateChat: chat => {
            dispatch({ type: 'CREATE_CHAT', chat }); // ТУДУ update sore
        }
    })
)(PureProfile);
