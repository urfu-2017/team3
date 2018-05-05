'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../../pages/global-const.css';
import './profile.css';
import { connect } from 'react-redux';

function getGroupInviteLink(url, id) {
    return `${url}invite/g_${id.substr(18, 6)}`;
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

        const groupInviteLink = getGroupInviteLink(window.location, profile._id);

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
                        <CopyToClipboard text={groupInviteLink}>
                            <span className="profile__invite-link">
                                {groupInviteLink}
                            </span>
                        </CopyToClipboard>
                    </div>
                </div>
            </div>
        );
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
