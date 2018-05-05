'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../../pages/global-const.css';
import './profile.css';
import { connect } from 'react-redux';

function getGroupInviteLink(url, id) {
    return `${url}invite/g_${id}`;
}

/* eslint-disable max-statements */

class Profile extends Component {
    hideProfile = () => {
        this.props.onHideProfile();
    };

    whoIsMyInterlocutor(profile) {
        if (profile.type === 'group') {
            return {
                avatar: profile.avatar,
                nickname: profile.title
            };
        }

        const { members } = profile;

        if (members[0].nickname === this.props.user.nickname) {
            return members[1];
        }

        return members[0];
    }

    onFileChange = async e => {
        /* eslint-disable react/jsx-no-bind */
        /* eslint-disable react/self-closing-comp */
        /* eslint-disable prefer-destructuring */
        this.props.onShowLoader();
        const file = e.target.files[0];

        const formData = new FormData();

        formData.append('userAvatar', file);

        const response = await fetch(`/api/users/${this.props.user.nickname}/avatar`, {
            credentials: 'include',
            method: 'PATCH',
            body: formData
        });

        if (response.status === 200) {
            const answer = await response.json();

            this.props.onChangeAvatar(answer.url);
        }
        this.props.onHideLoader();
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

        const displayData = this.whoIsMyInterlocutor(profile);

        return (
            <div className="darkness" onClick={this.hideProfile}>
                <div className="profile" onClick={event => event.stopPropagation()}>
                    <div className="profile__avatar-box">
                        <img className="profile__avatar" src={displayData.avatar} alt="avatar" />
                    </div>
                    <div className="profile__info-box">
                        <span className="profile__nickname">
                            {displayData.nickname}
                        </span>

                        {this.inviteLink(profile)}
                    </div>
                </div>
            </div>
        );
    }

    inviteLink(profile) {
        const groupInviteLink = getGroupInviteLink(window.location, profile.inviteId);

        if (profile.inviteId) {
            return (
                <CopyToClipboard text={groupInviteLink}>
                    <span className="profile__invite-link">Get Invite link</span>
                </CopyToClipboard>);
        }

        return <div />;
    }
}

Profile.propTypes = {
    profile: PropTypes.object,
    onHideProfile: PropTypes.func,
    user: PropTypes.object,
    onShowLoader: PropTypes.func,
    onHideLoader: PropTypes.func,
    onChangeAvatar: PropTypes.func
};

export default connect(
    state => ({ profile: state.modal.profile, user: state.user }),
    dispatch => ({
        onHideProfile: () => {
            dispatch({ type: 'HIDE_PROFILE' });
        },
        onShowLoader: () => {
            dispatch({ type: 'SHOW_LOADER' });
        },
        onHideLoader: () => {
            dispatch({ type: 'HIDE_LOADER' });
        },
        onChangeAvatar: avatar => {
            dispatch({ type: 'CHANGE_AVATAR', avatar });
        }
    })
)(Profile);
