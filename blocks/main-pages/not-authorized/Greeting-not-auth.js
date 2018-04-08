'use strict';

import React, { Component } from 'react';

import './Greeting-not-auth.css';

export default class Greeting extends Component {
    render() {
        return (
            <div className="log-in__welcome">
                <p className="log-in__welcome-text">
                Добро пожаловать в наш мессенджер! Здесь ты сможешь
                общаться со своими друзьями и делиться с ними самыми
                свежими новостями о своей личной (яичной) жизни!
                </p>
            </div>
        );
    }
}
