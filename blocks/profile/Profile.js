'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../common-components/Button';

import './Profile.css';

export default class Profile extends Component {
    render() {
        const { user } = this.props;

        const sizeBtn = {
            width: '100px',
            height: '50px'
        };

        const chatWithUser = {
            link: `/im`,
            text: 'Написать',
            class: 'profile-page-btns__chat-link',
            onClick: async () => {
                const response = await fetch('/api/chats', {
                    method: 'POST',
                    body: {
                        interlocutorId: user.id
                    }
                });

                const json = await response.json();

                localStorage.setItem('chatProps', JSON.stringify(json));
                window.location.href = '/im';
            },
            size: sizeBtn
        };
        const githubPageUser = {
            link: `https://github.com/${user.nickname}/`,
            text: 'Страница на GitHub',
            class: 'profile-page-btns__github-link',
            size: sizeBtn
        };
        const logoutProps = {
            link: '/logout',
            text: 'Выйти из профиля',
            class: 'profile-page-btns__logout-link',
            size: sizeBtn
        };
        const closeProps = {
            link: '/',
            text: 'Домой',
            class: 'profile-page-btns__home-link',
            size: sizeBtn
        };

        const avatarSrc = `data:image/svg+xml;base64,${user.avatar}`;

        return (
            <React.Fragment>
                <article className="profile">
                    <h2 className="profile__nickname">{user.nickname}</h2>
                    <img
                        src={avatarSrc}
                        alt="user avatar"
                        className="profile__avatar"
                    />
                    <ul className="profile__info">
                        <h3 className="profile__info-title">Информация о пользователе:</h3>
                        <li className="profile__info-item">ID: {user.id}</li>
                        <li className="profile__info-item">Еще информация:</li>
                        <li className="profile__info-item">Еще информация:</li>
                    </ul>
                    <section className="profile__btns">
                        <Button btnParams={chatWithUser} />
                        <Button btnParams={githubPageUser} />
                        <Button btnParams={logoutProps} />
                        <Button btnParams={closeProps} />
                    </section>
                </article>
            </React.Fragment>
        );
    }
}

Profile.propTypes = { user: PropTypes.object };
