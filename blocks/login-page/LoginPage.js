'use strict';

import React, { Component } from 'react';

import Button from './Button';

import './LoginPage.css';

export default class LoginPage extends Component {
    render() {
        const logIn = {
            link: '/login',
            text: 'Войти через GitHub',
            class: 'log-in__github-link',
            size: {
                width: '150px',
                height: '50px'
            }
        };

        return (
            <React.Fragment>
                <head>
                    <title>K1logram</title>
                </head>
                <main className="log-in">
                    <img className="log-in__logo" src="static/main-label.svg" alt="Логотип" />
                    <Button btnParams={logIn} />
                    <p className="log-in__team3 team3_1">Смайлы</p>
                    <p className="log-in__team3 team3_2">Возможность загрузки своей аватарки</p>
                    <p className="log-in__team3 team3_3">Список контактов</p>
                    <p className="log-in__team3 team3_4">Drag&prime;n&prime;Drop фоток</p>
                    <p className="log-in__team3 team3_5">Профиль пользователя</p>
                    <p className="log-in__team3 team3_6">Микроразметка</p>
                    <p className="log-in__team3 team3_7">Авторизация через Github</p>
                    <p className="log-in__team3 team3_8">Подтягивание meta-данных</p>
                    <p className="log-in__team3 team3_9">Прикрепление фоток</p>
                    <p className="log-in__team3 team3_10">Интерфейс чата</p>
                    <p className="log-in__team3 team3_11">Emoji</p>
                    <p className="log-in__team3 team3_12">Аватарки как на GitHub</p>
                    <p className="log-in__team3 team3_13">Обмен сообщениями</p>
                    <p className="log-in__team3 team3_14">Групповые чаты</p>
                    <p className="log-in__team3 team3_15">Инвайты в группу и в личный чат</p>
                </main>
            </React.Fragment>
        );
    }
}
