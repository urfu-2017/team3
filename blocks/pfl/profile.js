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

    render() {
        const { profile } = this.props;

        if (!profile) {
            return (<div />);
        }

        let avatalLink = '';
        let title = '';

        if (profile.nickname) {
            title = profile.nickname;
            avatalLink = `data:image/svg+xml;base64,${profile.avatar}`;
        } else {
            const man = this.whoIsMyInterlocutor(profile.members);

            title = man.nickname;
            avatalLink = man.avatar;
        }

        return (
            <div className="darkness" onClick={this.hideProfile}>
                <div className="profile">
                    <div className="profile__avatar-box">
                        <img className="profile__avatar" src={avatalLink} alt="avatar" />
                    </div>
                    <div className="profile__info-box">
                        <span className="profile__nickname">
                            {title}
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
