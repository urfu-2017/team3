'use strict';

import React, { Component } from 'react';

import Button from '../common-components/Button';

export default class Header extends Component {
    // state = { haveOpenedChat: false }

    render() {
        // const { haveOpenedChat } = this.state;
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
            <div className="header">
                <Button btnParams={goToMenu} />;
                <img
                    src="/static/kg64.svg"
                    width="64px" height="64px"
                    className="header__label"
                />
                {/* { haveOpenedChat ? <span className="header__chat-name">''</span> : } */}
                <Button btnParams={goToProfile} />;
            </div>
        );
    }
}
