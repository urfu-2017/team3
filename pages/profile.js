'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ProfilePage extends Component {

    static getInitialProps({ req }) {
        const { user } = req;

        return { user };
    }

    render() {
        const { user } = this.props;
        const avatarSrc = `data:image/svg+xml;base64,${user.avatar}`;

        return (
            <div>
                <p>
                    <a href="/">Home</a>
                </p>

                <img src={avatarSrc} width="100" height="100" alt="user avatar" />
                <dl>
                    <dt>ID: </dt><dd>{user.id }</dd>
                    <dt>Username: </dt><dd>{user.nickname}</dd>
                </dl>
            </div>
        );
    }
}

ProfilePage.propTypes = { user: PropTypes.object };
