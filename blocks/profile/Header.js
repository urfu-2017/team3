'use strict';

import React, { Component } from 'react';

import Button from '../common-components/Button';

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
            <React.Fragment>
                <img
                    src="/static/kg64.svg"
                    width="64px" height="64px"
                    className="header__label"
                />
                <Button btnParams={goToProfile} />;
            </React.Fragment>
        );
    }
}
