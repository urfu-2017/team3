import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

class PureProfile extends Component {
    createChat = () => {
        const { user } = this.props;

        this.props.onCreateChat(user.nickname);
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
    () => ({}),
    dispatch => ({
        onCreateChat: interlocutor => {
            dispatch({ type: 'CREATE_CHAT', interlocutor }); // ТУДУ update sore
        }
    })
)(PureProfile);
