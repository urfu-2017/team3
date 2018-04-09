'use strict';

import React, { Component } from 'react';

import Greeting from './Greeting-not-auth';

export default class MainPage extends Component {
    render() {
        return (
            <React.Fragment className="log-in">
                <Greeting />
                <a href="/login" className="log-in__github-link">Войти через Github</a>
            </React.Fragment>
        );
    }
}
