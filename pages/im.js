'use strict';

/* eslint react/jsx-no-bind: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Chats from '../blocks/chats-page/Chats';
import ChatWindow from '../blocks/chats-page/ChatWindow';
import Profile from '../blocks/pfl/profile';

import 'isomorphic-fetch';
import './global-const.css';
import './im.css';

// const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class MainPage extends Component {
    // showUserProfile - хранит или null или юзера котрого нужно показать!
    state = { user: null, chats: null, showUserProfile: null, openChat: null }

    showProfile = user => this.setState({ showUserProfile: user });
    hideProfile = e => this.setState({ showUserProfile: null });

    clickToOpenChat = chatProps => this.setState({ openChat: chatProps });

    static getInitialProps = async ({ user, headers }) => {
        const response = await fetch(`/api/chats`, {
            credentials: 'include',
            headers: {
                cookie: headers.cookie
            }
        });

        const chats = await response.json();

        return { user, chats };
    }

    static getDerivedStateFromProps = ({ user, chats }) => {
        return { user, chats };
    }

    render() {
        const { user, chats, showUserProfile, openChat } = this.state;

        return (
            <React.Fragment>
                <head>
                    <title>{user.nickname}</title>
                </head>
                <main className="main">
                    <article className="chats">
                        <div className="chats__search">
                            <div className="chats__box-burger" onClick={() => this.showProfile(user)}>a</div>
                            <input
                                type="text"
                                className="chats__search-input"
                                placeholder="Найти пользователя"
                            />
                        </div>
                        <div className="chats__list">
                            <Chats chatsList={chats} clickToOpenChat={this.clickToOpenChat} />
                        </div>
                    </article>
                    <article className="dialog">
                        <ChatWindow
                            user={user}
                            openChat={openChat}
                            showProfile={this.showProfile}
                        />
                    </article>
                </main>
                {/* Показываем профиль юзера или нет */}
                { showUserProfile
                    ?
                        <div className="darkness" onClick={() => this.hideProfile()}>
                            <Profile user={showUserProfile} />
                        </div>
                    :
                    null
                }
            </React.Fragment>
        );
    }
}

MainPage.propTypes = {
    user: PropTypes.object
};
