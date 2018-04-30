'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../pages/global-const.css';
import './profile.css';

export default class Profile extends Component {
    static getInitialProps = ({ user }) => {
        return { user };
    }

    render() {
        const { user } = this.props;
        const avatalLink = `data:image/svg+xml;base64,${user.avatar}`;

        return (
            <div className="profile">
                <div className="profile__avatar-box">
                    <img className="profile__avatar" src={avatalLink} alt="avatar" />
                </div>
                <div className="profile__info-box">
                    <span className="profile__nickname">{user.nickname || user.title}</span>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.object
};
