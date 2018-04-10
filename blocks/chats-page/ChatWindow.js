'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from '../common-components/Message';

import './ChatWindow.css';

export default class ChatWindow extends Component {
    // state = { haveOpenedChat: false }

    render() {
        // const { haveOpenedChat } = this.state;
        const { chatid } = this.props;

        const messages = [
            {
                text: 'Привет!',
                userid: 123
            },
            {
                text: 'Как дела?',
                userid: 123
            },
            {
                text: 'Отлично!',
                userid: 888
            }
        ];

        return (
            <nav className="dialog">
                {chatid === null
                    ?
                        <span>Пусто! Выбери диалог</span>
                    :
                        <section className="chat-window">
                            <h3 className="chat-window__title">Открыт диалог {chatid}</h3>
                            <div className="chat-window__messages">
                                {messages.map(message => (<Message key="2" message={message} />))}
                            </div>
                        </section>
                }
            </nav>
        );
    }
}

ChatWindow.getInitialProps = ({ chatid }) => {
    // await fetch(`${URL}/api/СЮДАidЧАТА/messages`)
    //     .then((res)=>{
    //         return res.json();
    //     })
    //     .then((data)=>{
    //         chats = data;
    //     });

    return { chatid };
};

ChatWindow.propTypes = { chatid: PropTypes.number };
