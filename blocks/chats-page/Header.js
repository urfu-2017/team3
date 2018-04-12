'use strict';

import React, { Component } from 'react';

import Button from '../common-components/Button';

import './Header.css';
import '../header/Header-common.css';

export default class Header extends Component {
    // state = { haveOpenedChat: false }

    render() {
        // const { chats } = this.props;
        const goToMenu = {
            link: '/',
            text: 'Домой',
            class: 'header__menu-link',
            size: {
                width: '150px',
                height: '64px'
            }
        };
        const goToProfile = {
            link: '/profile',
            text: 'Мой профиль',
            class: 'header__profile-link',
            size: {
                width: '150px',
                height: '64px'
            }
        };

        return (
            <header className="header">
                <Button btnParams={goToMenu} />
                <img
                    src="/static/main-label.svg"
                    width="64px" height="64px"
                    className="header__label"
                />
                {/* { haveOpenedChat ? <span className="header__chat-name">''</span> : } */}
                <Button btnParams={goToProfile} />
            </header>
        );
    }
}
