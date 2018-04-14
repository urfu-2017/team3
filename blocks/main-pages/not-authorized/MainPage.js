'use strict';

import React, { Component } from 'react';

import Button from '../../common-components/Button';

import Greeting from './Greeting-not-auth';

import './MainPage.css';
import '../MainPage-common.css';

export default class MainPage extends Component {
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
                    <Greeting />
                    <Button btnParams={logIn} />
                </main>
            </React.Fragment>
        );
    }
}
