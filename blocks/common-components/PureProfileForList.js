import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import getSocket from '../../pages/socket';

class PureProfile extends Component {
    createChat = () => {
        const socket = getSocket();

        const { user, myUser } = this.props;

        socket.emit('chat', {
            members: [myUser.nickname, user.nickname], // Важно! создатель первый в списке
            type: 'private'
        }, chat => {
            if (chat) {
                this.props.onCreateChat(chat);
            }
        });
    }

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
    onCreateChat: PropTypes.func
};

export default connect(
    state => ({
        myUser: state.user
    }),
    dispatch => ({
        onCreateChat: chat => {
            dispatch({ type: 'CREATE_CHAT', chat });
        }
    })
)(PureProfile);
