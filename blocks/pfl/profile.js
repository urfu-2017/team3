'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../pages/global-const.css';
import './profile.css';
import { connect } from 'react-redux';

class Profile extends Component {
    hideProfile = () => {
        this.props.onHideProfile();
    }

    render() {
        const { profile } = this.props;

        if (!profile) {
            return (<div />);
        }

        const avatalLink = `data:image/svg+xml;base64,${profile.avatar}`;

        return (
            <div className="darkness" onClick={this.hideProfile}>
                <div className="profile">
                    <div className="profile__avatar-box">
                        <img className="profile__avatar" src={avatalLink} alt="avatar" />
                    </div>
                    <div className="profile__info-box">
                        <span className="profile__nickname">
                            {profile.nickname || profile.title}
                        </span>
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
    state => ({ profile: state.profile }),
    dispatch => ({
        onHideProfile: () => {
            dispatch({ type: 'HIDE_PROFILE' });
        }
    })
)(Profile);
