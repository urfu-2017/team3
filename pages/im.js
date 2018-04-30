'use strict';

/* eslint react/jsx-no-bind: 0 */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

import fetch from 'node-fetch';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Chats from '../blocks/chats-page/Chats';
import Search from '../blocks/chats-page/Search';
import ChatWindow from '../blocks/chats-page/ChatWindow';
import Profile from '../blocks/pfl/profile';
import PureProfile from '../blocks/common-components/PureProfileForList';

import 'isomorphic-fetch';
import './global-const.css';
import './im.css';

// const URL = `${process.env.HOST}:${process.env.PORT}`;

export default class MainPage extends Component {
    // showUserProfile - хранит или null или юзера котрого нужно показать!
    state = { user: null, chats: null, showUserProfile: null, openChat: null, foundUsersList: false }
    createChat = async interlocutor => {
        const response = await fetch('api/chats/', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                members: [interlocutor, this.props.user.nickname],
                type: 'private'
            })
        });

        if (response.status === 200) {
            const createdChat = await response.json();

            this.state.chats.push(createdChat);
        }
    }

    showProfile = user => this.setState({ showUserProfile: user });
    hideProfile = e => this.setState({ showUserProfile: null });

    clickToOpenChat = chatProps => this.setState({ openChat: chatProps });

    showFoundResults = userList => this.setState({ foundUsersList: userList });

    showFoundUsers = () => {
        return this.state.foundUsersList.map(user => {
            return (
                <PureProfile
                    key={user.nickname}
                    user={user}
                    createChat={this.createChat}
                />
            );
        });
    }

    // static getInitialState = async () => {
    //     const { user } = this.props;

    //     const response = await fetch('api/chats/', {
    //         credentials: 'include',
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //     });

    //     const chats = await response.json();
    //         this.state.chats.push(createdChat);
    //     }

    //     return { user: null, chats: null, showUserProfile: null, openChat: null, foundUsersList: false }
    // }
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
                            <Search
                                user={user}
                                showProfile={this.showProfile}
                                findUsers={this.showFoundResults}
                            />
                        </div>
                        <div className="chats__list">
                            <Chats chatsList={chats} clickToOpenChat={this.clickToOpenChat} />
                        </div>
                        {this.state.foundUsersList
                            ?
                                <div className="chats__found-users">
                                    {this.showFoundUsers()}
                                </div>
                            :
                            null
                        }

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
