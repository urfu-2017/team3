'use strict';

import React, { Component } from 'react';

import Button from '../common-components/Button';

import './LoginPage.css';

export default class LoginPage extends Component {
    render() {
        const logIn = {
            link: '/login',
            text: 'Войти через GitHub',
            class: 'log-in__github-link',
            size: {
                width: '150px',
                height: '50px'
            }
        };

        return (
            <React.Fragment>
                <head>
                    <title>K1logram</title>
                </head>
                <main className="log-in">
                    <header className="log-in__welcome">
                        <p className="log-in__welcome-text">
                        Добро пожаловать в наш мессенджер!<br />K1logram -
                        общение без границ.
                        </p>
                    </header>
                    <Button btnParams={logIn} />
                </main>
            </React.Fragment>
        );
    }
}
