'use strict';

/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../blocks/chats-page/Header';
import Chats from '../blocks/chats-page/Chats';

const fetch = require('node-fetch');
const URL = `${process.env.HOST}:${process.env.PORT}`;
import ChatWindow from '../blocks/chats-page/ChatWindow';

export default class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {activeChat: null};
    }

    componentWillMount() {
        // Ставлю активный диалог перед рендером просто
        this.setState({activeChat: 22222});
    }
    
    render() {
        const { chats } = this.props;
        return (
            <React.Fragment>
                <Header />
                <article className="chats">
                    <input type="search" className="chats__search"/>
                    <div className="chats__list">
                        <Chats chatsList={chats}/>
                    </div>
                </article>
                <ChatWindow chatid={this.state.activeChat}/>
            </React.Fragment>
        );
    }
}

// здесь линтер даже с дизейблом ругается на async/await, 
// хотя у Гоголева ТАКОЙ ЖЕ КОМЬЮТЕР И ВСЕ РАБОТАЕТ
ProfilePage.getInitialProps =  () => {
    let chats = null;
    // await fetch(`${URL}/api/chats`)
    //     .then((res)=>{
    //         return res.json();
    //     })
    //     .then((data)=>{
    //         chats = data;
    //     });

    chats = [{
        id: 123,
        name: 'bobby',
        lastMessage: 'Привет!'
    },
    {
        id: 321321,
        name: 'sergey',
        lastMessage: 'доделывать будем?'
    }]

    return { chats };
};

ProfilePage.propTypes = { user: PropTypes.object };
