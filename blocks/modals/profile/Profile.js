'use strict';
/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../../../pages/global-const.css';
import './Profile.css';
import { connect } from 'react-redux';

import { hideProfile, showFullSize, showWarning } from '../../../actions/modals';
import { changeAvatar } from '../../../actions/user';
import { createChat } from '../../../actions/chats';
import Chat from '../../../models/Chat';

function getGroupInviteLink(url, id) {
    return `${url}invite/g_${id}`;
}

/* eslint-disable react/jsx-closing-bracket-location */

class Profile extends Component {
    state = {}

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

    static getDerivedStateFromProps(newProps) {
        if (newProps.profile) {
            return {
                notificationsEnabled: new Chat(newProps.profile).settings.notificationsEnabled()
            };
        }

        return null;
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

    getChargeBattery = nickname => {
        const user = this.props.activeChat.members.find(member => member.nickname === nickname);

        if (user.battery) {
            return (
                <span
                    className="contacts__battery"
                    title={`${Math.floor(user.battery.level * 100)}% заряда батареи` +
                    `${user.battery.isCharging
                        ?
                        ', заряжается'
                        :
                        ''
                    }`}
                    >
                    {`${Math.floor(user.battery.level * 100)}% заряда батареи` +
                    `${user.battery.isCharging
                        ?
                        ', заряжается'
                        :
                        ''
                    }`}
                </span>
            );
        }

        return null;
    };

    /* eslint-disable max-statements */
    onFileChange = e => {
        const [file] = e.target.files;

        const isTypeWarning = !file.type.startsWith('image');
        const isSizeWarning = file.size >= 5242880;

        if (isTypeWarning) {
            const text = 'Аватар не доступен для загрузки в указанном формате. ' +
            'Попробуйте загрузить другой аватар.';

            this.hideProfile();
            this.props.showWarning(text);

            return false;
        } else if (isSizeWarning) {
            const text = 'Размер аватара ' +
            'превышает 5МБ. Попробуйте загрузить файл меньшего размера.';

            this.hideProfile();
            this.props.showWarning(text);

            return false;
        }

        this.props.changeAvatar(file, this.props.user);
    }

    copiedNotify = e => {
        const infoBox = document.querySelector('.profile__info-box');
        const copied = document.createElement('div');

        copied.className = 'profile__copied';
        copied.innerHTML = 'Copied!';

        copied.style.top = `${e.clientY}px`;
        copied.style.left = `${e.clientX}px`;
        copied.classList.add('profile__copied-animation');
        infoBox.appendChild(copied);
    }

    showImgHideProfile = e => {
        this.props.hideProfile();
        this.props.showFullSize(e);
    }

    toggleNotifications = () => {
        const toggledValue = !this.state.notificationsEnabled;

        this.setState({ notificationsEnabled: toggledValue });

        new Chat(this.props.profile).settings.switchNotifications(toggledValue);
    }

    /* eslint-disable complexity */
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
                                    draggable="false"
                                />
                            </label>
                            <label htmlFor="imginput">
                                <div className="profile__avatar-hover">
                                    <img
                                        className="profile__avatar_new"
                                        src="/static/upload_avatar.svg"
                                        alt="загрузить новый аватар"
                                        draggable="false"
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
                            <span
                                className="profile__nickname"
                                title={profile.nickname}
                                >
                                {profile.nickname}
                            </span>
                            <CopyToClipboard
                                text={`${window.location}invite/${profile.nickname}`}
                                >
                                <span
                                    className="profile__invite-link profile__control"
                                    onClick={this.copiedNotify}
                                    >
                                    Получить ссылку-приглашение
                                </span>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
            );
        }

        const displayData = this.whoIsMyInterlocutor(profile);

        // ЕСЛИ ПРОФИЛЬ ЮЗЕРА
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
                                onClick={this.showImgHideProfile}
                                draggable="false"
                            />
                        </div>
                        <div className="profile__info-box">
                            <span
                                className="profile__nickname"
                                title={this.getInterlocutor(profile).nickname}
                                >
                                {this.getInterlocutor(profile).nickname}
                            </span>
                            <input
                                type="checkbox"
                                id="profile__notification_hidden"
                                className="profile__notification_hidden"
                                onChange={this.toggleNotifications}
                                checked={this.state.notificationsEnabled} />
                            <label
                                htmlFor="profile__notification_hidden"
                                className="profile__notification"
                                title={this.state.notificationsEnabled
                                    ?
                                    'Отключить уведомления'
                                    :
                                    'Включить уведомления'}
                                >
                                <span className="profile__notification_description_add
                                profile__control">
                                    {this.state.notificationsEnabled
                                        ?
                                        'Уведомления включены'
                                        :
                                        'Уведомления отключены'}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            );
        }

        // ЕСЛИ ИНФОРМАЦИЯ О ГРУППЕ
        return (
            <div className="darkness" onClick={this.hideProfile}>
                <div
                    className="profile"
                    onClick={event => event.stopPropagation()}
                    >
                    <div className="profile__avatar-box">
                        <img
                            className="profile__avatar"
                            src={displayData.avatar}
                            alt="avatar"
                            onClick={this.showImgHideProfile}
                            draggable="false"
                        />
                    </div>
                    <div className="profile__info-box profile__info-box_group">
                        <span
                            className="profile__nickname"
                            title={displayData.nickname}
                            >
                            {displayData.nickname}
                        </span>
                        <span
                            onClick={this.copiedNotify}
                            className="profile__invite-link_wrapper"
                            >
                            {this.inviteLink(profile)}
                        </span>
                        <input
                            type="checkbox"
                            id="profile__notification_hidden"
                            className="profile__notification_hidden"
                            onChange={this.toggleNotifications}
                            checked={this.state.notificationsEnabled} />
                        <label
                            htmlFor="profile__notification_hidden"
                            className="profile__notification"
                            title={this.state.notificationsEnabled
                                ?
                                'Отключить уведомления'
                                :
                                'Включить уведомления'}
                            >
                            <span className="profile__notification_description_add
                                profile__control">
                                {this.state.notificationsEnabled
                                    ?
                                    'Уведомления включены'
                                    :
                                    'Уведомления отключены'}
                            </span>
                        </label>
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
                                            {this.getChargeBattery(m.nickname)}
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
                    <span className="profile__invite-link profile__control">
                        Получить ссылку-приглашение
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
    createChat: PropTypes.func,
    showFullSize: PropTypes.func,
    activeChat: PropTypes.object,
    showWarning: PropTypes.func
};

export default connect(
    state => ({
        profile: state.modal.profile,
        user: state.user,
        activeChat: state.chats.find(c => state.activeChat && c._id === state.activeChat.id)
    }), {
        hideProfile,
        changeAvatar,
        createChat,
        showFullSize,
        showWarning
    }
)(Profile);
