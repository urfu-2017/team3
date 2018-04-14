'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../blocks/profile/Header';
import Profile from '../blocks/profile/Profile';

import 'isomorphic-fetch';
import './global-const.css';

const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class ProfilePage extends Component {
    static async getInitialProps({ req }) {
        const { id } = req.params;

        if (!id) {
            return { user: req.user };
        }

        const response = await fetch(`${URL}/api/users/${id}`);
        const user = await response.json();

        return { user, cookie: req.headers.cookie };
    }

    render() {
        const { user, cookie } = this.props;

        return (
            <React.Fragment>
                <head>
                    <title>Ki1oPr0fi1e</title>
                </head>
                <Header />
                <Profile user={user} cookie={cookie} />
            </React.Fragment>
        );
    }
}

ProfilePage.propTypes = {
    user: PropTypes.object,
    cookie: PropTypes.string
};
