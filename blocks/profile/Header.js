'use strict';

import React, { Component } from 'react';

import Button from '../common-components/Button';

import './Header.css';

export default class Header extends Component {
    render() {
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
                <img
                    src="/static/main-label.svg"
                    width="64px" height="64px"
                    className="header__label"
                />
                <span className="header__name">|&lt; |/| /\ 0 |` /&gt; 4 /^\</span>
                <Button btnParams={goToProfile} />
            </header>
        );
    }
}
