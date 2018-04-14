'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../common-components/Button';

import Greeting from './Greeting-auth';

import './MainPage.css';
import '../MainPage-common.css';

export default class Main extends Component {
    render() {
        const { nickname } = this.props;

        const sizeBtn = {
            width: '110px',
            height: '50px'
        };

        const goToProfile = {
            link: '/profile',
            text: 'Мой профиль',
            class: 'manage-frame__profile-link',
            size: sizeBtn
        };
        const goToChats = {
            link: '/im',
            text: 'Диалоги',
            class: 'manage-frame__chats-link',
            size: sizeBtn
        };
        const logoutProps = {
            link: '/logout',
            text: 'Выйти',
            class: 'manage-frame__logout-link',
            size: sizeBtn
        };

        return (
            <React.Fragment>
                <head>
                    <title>K1logram</title>
                </head>
                <main className="authorized-page">
                    <header className="user-greeting">
                        <Greeting nickname={nickname} className="user-greeting__text" />
                    </header>
                    <nav className="manage-frame">
                        <Button btnParams={goToProfile} />
                        <Button btnParams={goToChats} />
                        <Button btnParams={logoutProps} />
                    </nav>
                </main>
            </React.Fragment>
        );
    }
}

Main.propTypes = { nickname: PropTypes.string };
