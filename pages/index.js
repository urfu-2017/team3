'use strict';

import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { Provider } from 'react-redux';

import LogInPage from '../blocks/main-pages/not-authorized/MainPage';
import store from '../store';

import MainPage from './MainPage.js';
import './global-const.css';

export default class StartPage extends Component {
    static getInitialProps({ req }) {
        const { user } = req;

        return { user };
    }

    async componentDidMount() {
        // Загружаем чатики и кидаем событие после загрузки
        const res = await fetch('/api/chats', { credentials: 'include' });
        const chats = await res.json();

        store.dispatch({ type: 'LOAD_CHATS', chats });

        // Если есть юзер кидаем событие, что юзер залогинен
        if (this.props.user) {
            store.dispatch({ type: 'LOGIN_USER', user: this.props.user });
        }
    }

    render() {
        const { user } = this.props;

        return (
            <Provider store={store}>
                { user
                    ? <MainPage />
                    : <LogInPage /> }
            </Provider>
        );
    }
}
