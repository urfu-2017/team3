'use strict';
/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from '../common-components/Message';

import './ChatWindow.css';

export default class ChatWindow extends Component {
    // user - я, id/name - собеседника ид и имя
    // раскомментировать
    // state = { user: null, id: null, name: null, messages: [], msgText: '' };

    componentWillReceiveProps(nextProps) {
        // Если приходят chatProps - значит нажали на диалог, отсекаем первый холостой
        // И отрезаем нажатие на открытый диалог
        if (nextProps.chatProps && nextProps.chatProps.id !== this.state.id) {
            const chatProps = nextProps.chatProps;
            const user = nextProps.user;
            const { id, name } = chatProps;
            this.setState({ user: user, id: id, name: name, msgText: '' });
            // await fetch(`${URL}/api/id/messages`)
            //     .then((res)=>{
            //         return res.json();
            //     })
            //     .then((data)=>{
            //         messages = data;
            //     });
            const messages = [
                {
                    id: 1,
                    content: 'Привет!',
                    meta: {
                        author: 11111,
                        date: '12-08-1997'
                    }
                },
                {
                    id: 2,
                    content: 'Как дела?',
                    meta: {
                        author: 11111,
                        date: '12-08-1997'
                    }
                }
            ];

            this.setState({messages: messages});
        }
    }
    // раскомментировать

    // change = event => this.setState({ msgText: event.target.value });

    // submit = event => {
    //     // Здесь делаем отправку на сервер
    //     // Если пришло 201 то добавляем локально
    //     // id сообщения подписываем из ответа
    //     // const res = await fetch(`${URL}/api/ОТПРАВИТЬ_СООБЩЕНИЕ`);
    //     const res = {status: 201, id: Math.floor(Math.random()*10000)};
    //     if (res.status === 201) {
    //         const messages = this.state.messages;
    //         messages.push({
    //             id: res.id,
    //             content: this.state.msgText,
    //             meta: {
    //                 author: this.state.user.id,
    //                 date: new Date()
    //             }
    //         });
    //         // Это функция из im - меняет lastMessage локально
    //         this.props.changeLastMessage(this.state.id, this.state.msgText);
    //         this.setState({ messages: messages, msgText: '' });
    //     }
    // }


    render() {
        const { user, id, name, messages, msgText } = this.state;
        // const { changeLastMessage } = this.props;

        return (
            <nav className="dialog">
                {id === null || id === undefined
                    ?
                        <section className="chat-window">
                            <div className="chat-window__title">Открой диалог</div>
                        </section>
                    :
                        <section className="chat-window">
                            <div className="chat-window__title">Открыт диалог с {name}</div>
                            <div className="chat-window__messages">
                                {messages.map(message => (
                                    <Message key={message.id} message={message} user={user} name={name}/>
                                ))}
                            </div>
                            <div className="chat-window__write">
                                <input value={msgText} onChange={this.change} type="text" className="chat-window__input"/>
                                <div onClick={this.submit} className="chat-window__send-btn">send</div>
                            </div>
                        </section>
                }
            </nav>
        );
    }
}

ChatWindow.getInitialProps = () => {
    // Пустует
};

ChatWindow.propTypes = { messages: PropTypes.array };
