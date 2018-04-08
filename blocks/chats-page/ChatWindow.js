'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ChatWindow extends Component {
    // state = { haveOpenedChat: false }

    render() {
        // const { haveOpenedChat } = this.state
        const { chatid } = this.props;

        return (
            <div className="dialog">
                {chatid === null
                    ? <span>Пусто! Выбери диалог</span>
                    : <span>Открыт диалог {chatid}</span>}
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

ChatWindow.propTypes = { chatid: PropTypes.string };
