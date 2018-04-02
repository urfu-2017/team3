'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class StartPage extends Component {
    static getInitialProps({ req }) {
        const { user } = req;

        return { user };
    }

    render() {
        const { user } = this.props;

        if (user) {
            return (
                <p>Hello, {user.nickname}. View your <a href="/profile">profile</a>.
                    Or <a href="/logout">log out</a>
                </p>
            );
        }

        return (
            <p>Welcome! Please <a href="/login">log in with GitHub</a>.</p>
        );
    }
}

StartPage.propTypes = { user: PropTypes.object };
