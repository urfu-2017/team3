'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LogInPage from '../blocks/main-pages/not-authorized/MainPage';
import UserPage from '../blocks/main-pages/authorized/MainPage';

export default class StartPage extends Component {
    static getInitialProps({ req }) {
        const { user } = req;

        return { user };
    }

    render() {
        const { user } = this.props;

        return user ? <UserPage nickname={user.nickname} /> : <LogInPage />;
    }
}

StartPage.propTypes = { user: PropTypes.object };
