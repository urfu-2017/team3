'use strict';
/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../../../pages/global-const.css';
import './Profile.css';
import { connect } from 'react-redux';

import { hideProfile } from '../../../actions/modals';
import { changeAvatar } from '../../../actions/user';
import { createChat } from '../../../actions/chats';

function getGroupInviteLink(url, id) {
    return `${url}invite/g_${id}`;
}

/* eslint-disable react/jsx-closing-bracket-location */

class Profile extends Component {
    hideProfile = () => {
        this.props.hideProfile();
    };

    getInterlocutor = chat => {
        const interlocutors = chat.members.filter(member => {
            if (member.nickname !== this.props.user.nickname) {
                return true;
            }

            return false;
        });

        return interlocutors[0];
    };

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideProfile();
            }
        });
    }

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

    onFileChange = e => {
        const [file] = e.target.files;

        this.props.changeAvatar(file, this.props.user);
    }

    copiedNotify = e => {
        this.copied.style.top = `${e.clientY}px`;
        this.copied.style.left = `${e.clientX}px`;
        this.copied.style.opacity = 0;
    }

    render() {
        const { profile } = this.props;

        if (!profile) {
            return (<div />);
        }

        // ЕСЛИ СВОЙ ПРОФИЛЬ
        if (profile.nickname === this.props.user.nickname) {
            return (
                <div className="darkness" onClick={this.hideProfile}>
                    <div
                        className="profile"
                        onClick={event => event.stopPropagation()}
                        >
                        <div className="profile__avatar-box">
                            <label htmlFor="imginput">
                                <img
                                    className="profile__avatar"
                                    src={profile.avatar}
                                    alt="avatar"
                                />
                            </label>
                            <label htmlFor="imginput">
                                <div className="profile__avatar-hover">
                                    <img
                                        className="profile__avatar_new"
                                        src="/static/upload_avatar.svg"
                                        alt="загрузить новый аватар"
                                    />
                                </div>
                            </label>
                            <input
                                onChange={this.onFileChange}
                                name="userAvatar" id="imginput"
                                className="profile__new-avatar_input"
                                type="file"
                            />
                        </div>
                        <div className="profile__info-box">
                            <span className="profile__nickname">
                                {profile.nickname}
                            </span>
                            <CopyToClipboard
                                text={`${window.location}invite/${profile.nickname}`}
                                >
                                <span
                                    className="profile__invite-link"
                                    onClick={this.copiedNotify}
                                    >
                                    Copy invite link
                                </span>
                            </CopyToClipboard>
                            <div
                                className="profile__copied"
                                ref={copied => { this.copied = copied; }}
                                >Copied!
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const displayData = this.whoIsMyInterlocutor(profile);
        // туду отделить профиль пользователя от группы

        if (profile.type === 'private') {
            return (
                <div className="darkness" onClick={this.hideProfile}>
                    <div
                        className="profile"
                        onClick={event => event.stopPropagation()}
                        >
                        <div className="profile__avatar-box">
                            <img
                                className="profile__avatar"
                                src={this.getInterlocutor(profile).avatar}
                                alt="avatar"
                            />
                        </div>
                        <div className="profile__info-box">
                            <span className="profile__nickname">
                                {this.getInterlocutor(profile).nickname}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="darkness" onClick={this.hideProfile}>
                <div
                    className="profile"
                    onClick={event => event.stopPropagation()}
                    >
                    <div className="profile__avatar-box">
                        <img className="profile__avatar" src={displayData.avatar} alt="avatar" />
                    </div>
                    <div className="profile__info-box">
                        <span className="profile__nickname">
                            {displayData.nickname}
                        </span>
                        <span onClick={this.copiedNotify}>
                            {this.inviteLink(profile)}
                        </span>
                        <div
                            className="profile__copied"
                            ref={copied => { this.copied = copied; }}
                            >Copied!
                        </div>
                        <ul className="contacts">
                            {profile.members
                                ? profile.members.map(m => {
                                    return (
                                        <li
                                            className="contacts__user-box"
                                            key={m.nickname}
                                            onClick={() => {
                                                const { nickname } = this.props.user;

                                                if (m.nickname !== nickname) {
                                                    this.hideProfile();
                                                    this.props.createChat(this.props.user, m);
                                                }
                                            }}
                                            >
                                            <div className="contacts__nickname">
                                                {m.nickname}
                                            </div>
                                        </li>
                                    );
                                })
                                : null}
                        </ul>
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
                    <span className="profile__invite-link">
                        Copy invite link
                    </span>
                </CopyToClipboard>);
        }

        return <div />;
    }
}

Profile.propTypes = {
    profile: PropTypes.object,
    user: PropTypes.object,
    hideProfile: PropTypes.func,
    changeAvatar: PropTypes.func,
    createChat: PropTypes.func
};

export default connect(
    state => ({
        profile: state.modal.profile,
        user: state.user
    }), {
        hideProfile,
        changeAvatar,
        createChat
    }
)(Profile);
