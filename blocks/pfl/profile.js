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

class Profile extends Component {
    hideProfile = () => {
        this.props.onHideProfile();
    };

    render() {
        const { profile } = this.props;

        if (!profile) {
            return (<div />);
        }

        return (
            <div className="darkness" onClick={this.hideProfile}>
                <div className="profile">
                    <div className="profile__avatar-box">
                        <img className="profile__avatar" src={profile.avatar} alt="avatar" />
                    </div>
                    <div className="profile__info-box">
                        <span className="profile__nickname">
                            {profile.nickname || profile.title}
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
    onHideProfile: PropTypes.func
};

export default connect(
    state => ({ profile: state.modal.profile }),
    dispatch => ({
        onHideProfile: () => {
            dispatch({ type: 'HIDE_PROFILE' });
        }
    })
)(Profile);
