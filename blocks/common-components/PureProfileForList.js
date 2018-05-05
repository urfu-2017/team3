import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import getSocket from '../../pages/socket';

class PureProfile extends Component {
    createChat = () => {
        const socket = getSocket();

        const { user, myUser } = this.props;

        this.props.onStartChatCreation();
        socket.emit('chat', {
            members: [myUser.nickname, user.nickname], // Важно! создатель первый в списке
            type: 'private'
        }, (chat, existsChatId) => {
            if (chat) {
                this.props.onChatCreated(chat);
            } else {
                this.props.onChatExists(existsChatId);
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
    onStartChatCreation: PropTypes.func,
    onChatCreated: PropTypes.func,
    onChatExists: PropTypes.func
};

export default connect(
    state => ({
        myUser: state.user
    }),
    dispatch => ({
        onStartChatCreation: () => {
            dispatch({ type: 'SHOW_LOADER' });
            dispatch({ type: 'HIDE_ADDUSER' });
        },
        onChatCreated: chat => {
            dispatch({ type: 'CREATE_CHAT', chat });
            dispatch({ type: 'OPEN_CHAT', id: chat._id });
            dispatch({ type: 'HIDE_LOADER' });
        },
        onChatExists: chatId => {
            dispatch({ type: 'OPEN_CHAT', id: chatId });
            dispatch({ type: 'HIDE_LOADER' });
        }
    })
)(PureProfile);
