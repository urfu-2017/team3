'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from '../common-components/Message';

export default class ChatWindow extends Component {
    // state = { haveOpenedChat: false }

    render() {
        // const { haveOpenedChat } = this.state
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
            <div className="dialog">
                {chatid === null
                    ?
                        <span>Пусто! Выбери диалог</span>
                    :
                        <div>
                            <span>Открыт диалог {chatid}</span>
                            {messages.map(message => (<Message key="2" message={message} />))}
                        </div>
                }
            </div>
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
