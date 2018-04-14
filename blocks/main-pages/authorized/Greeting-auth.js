'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Greeting extends Component {
    render() {
        const { className, nickname } = this.props;

        return (
            <p className={className}>
                Привет, <strong>{nickname}</strong>!👋🏼 Мы рады, что ты пользуешься
                нашим приложением, оставайся с нами!
            </p>
        );
    }
}

Greeting.propTypes = {
    nickname: PropTypes.string,
    className: PropTypes.string
};
