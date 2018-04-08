'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../blocks/profile/Header';
import Profile from '../blocks/profile/Profile';

export default class ProfilePage extends Component {
    static getInitialProps({ req }) {
        const { user } = req;

        return { user };
    }

    render() {
        const { user } = this.props;

        return (
            <React.Fragment>
                <Header />
                <Profile user={user} />
            </React.Fragment>
        );
    }
}

ProfilePage.propTypes = { user: PropTypes.object };
