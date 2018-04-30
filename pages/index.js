'use strict';

import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import LogInPage from '../blocks/main-pages/not-authorized/MainPage';

import MainPage from './im.js';

import './global-const.css';

export default class StartPage extends Component {
    state = { user: null, headers: null }

    static getInitialProps({ req }) {
        const { user, headers } = req;

        return { user, headers };
    }

    static getDerivedStateFromProps = ({ user, headers }) => {
        return { user, headers };
    }

    render() {
        const { user, headers } = this.state;

        return user ? <MainPage user={user} headers={headers} /> : <LogInPage />;
    }
}
