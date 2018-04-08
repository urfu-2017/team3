'use strict';

import React, { Component } from 'react';

export default class ChatWindow extends Component {
    // state = { haveOpenedChat: false }
    static getInitialProps = async ({ chatid }) => {
         // await fetch(`${URL}/api/СЮДАidЧАТА/messages`)
        //     .then((res)=>{
        //         return res.json();
        //     })
        //     .then((data)=>{
        //         chats = data;
        //     });

        return { chatid };
    }

    render() {
        // const { haveOpenedChat } = this.state
        const { chatid } = this.props;

        return (
            <div className="dialog">
                {chatid == null
                    ? <span>Пусто! Выбери диалог</span>
                    : <span>Открыт диалог {chatid}</span>}
            </div>
        );
    }
}
