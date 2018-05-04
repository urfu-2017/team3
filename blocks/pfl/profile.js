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
