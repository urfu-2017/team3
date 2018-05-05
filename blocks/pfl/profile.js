'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../pages/global-const.css';
import './profile.css';
import { connect } from 'react-redux';

/* eslint-disable max-statements */

class Profile extends Component {
    hideProfile = () => {
        this.props.onHideProfile();
    }

    whoIsMyInterlocutor(members) {
        if (members[0].nickname === this.props.user.nickname) {
            return members[1];
        }

        return members[0];
    }

    onFileChange = async e => {
        /* eslint-disable react/jsx-no-bind */
        /* eslint-disable react/self-closing-comp */
        /* eslint-disable prefer-destructuring */
        const file = e.target.files[0];

        const formData = new FormData();

        formData.append('userAvatar', file);

        const response = await fetch(`/api/users/${this.props.user.nickname}/avatar`, {
            credentials: 'include',
            method: 'PATCH',
            body: formData
        });

        if (response.status === 200) {
            const users = await response.json();

            document.querySelector('.profile__avatar').src = users.url;

            console.log(users);
        }
    }

    render() {
        const { profile } = this.props;

        if (!profile) {
            return (<div />);
        }

        // ЕСЛИ СВОЙ ПРОФИЛЬ
        if (profile.nickname) {
            return (
                <div className="darkness" onClick={this.hideProfile}>
                    <div className="profile" onClick={event => event.stopPropagation()}>
                        <div className="profile__avatar-box">
                            <label htmlFor="imginput">
                                <img
                                    className="profile__avatar"
                                    src={profile.avatar}
                                    alt="avatar"
                                />
                            </label>
                            <label htmlFor="imginput">
                                <div className="profile__avatar-hover"></div>
                            </label>
                            <input
                                onChange={this.onFileChange}
                                name="userAvatar" id="imginput"
                                className="profile__input"
                                type="file"
                            />
                        </div>
                        <div className="profile__info-box">
                            <span className="profile__nickname">
                                {profile.nickname}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        // ЕСЛИ ПРОФИЛЬ ДРУГОГО ЮЗЕРА
        const userFromNet = this.whoIsMyInterlocutor(profile.members);

        return (
            <div className="darkness" onClick={this.hideProfile}>
                <div className="profile" onClick={event => event.stopPropagation()}>
                    <div className="profile__avatar-box">
                        <img className="profile__avatar" src={userFromNet.avatar} alt="avatar" />
                    </div>
                    <div className="profile__info-box">
                        <span className="profile__nickname">
                            {userFromNet.nickname}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    profile: PropTypes.object,
    onHideProfile: PropTypes.func,
    user: PropTypes.object
};

export default connect(
    state => ({ profile: state.modal.profile, user: state.user }),
    dispatch => ({
        onHideProfile: () => {
            dispatch({ type: 'HIDE_PROFILE' });
        }
    })
)(Profile);
