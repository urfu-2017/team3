'use strict';

import React, { Component } from 'react';

import './Greeting-not-auth.css';

export default class Greeting extends Component {
    render() {
        return (
            <header className="log-in__welcome">
                <p className="log-in__welcome-text">
                Добро пожаловать в наш мессенджер!<br />K1logram -
                общение без границ.
                </p>
            </header>
        );
    }
}
