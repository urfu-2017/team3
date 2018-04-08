'use strict';

/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../blocks/chats-page/Header';
import Chats from '../blocks/chats-page/Chats';

const fetch = require('node-fetch');
const URL = `${process.env.HOST}:${process.env.PORT}`;
// import ChatWindow from '../blocks/chats-page/ChatWindow';

export default class ProfilePage extends Component {
    // здесь линтер даже с дизейблом ругается на async/await, 
    // хотя у Гоголева ТАКОЙ ЖЕ КОМЬЮТЕР И ВСЕ РАБОТАЕТ
    static getInitialProps() {
        const response = fetch(`${URL}/api/chats`);
        const chats = response.json();

        return { chats };
    }

    render() {
        const { chats } = this.props;

        return (
            <React.Fragment>
                <Header />
                <article className="chats">
                    <input type="search" className="chats__search" />
                    <div className="chats__list">
                        <Chats chatsList={chats}/>
                    </div>
                </article>
                {/* <ChatWindow /> */}
            </React.Fragment>
        );
    }
}

ProfilePage.propTypes = { user: PropTypes.object };
