'use strict';

/* eslint-disable react/jsx-closing-bracket-location */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Button.css';

export default class Button extends Component {
    render() {
        const { btnParams } = this.props;

        return (
            <a
                className={`custom-button  ${btnParams.class}`}
                href={btnParams.link}
                style={{ width: btnParams.size.width, height: btnParams.size.height }}
                >
                {btnParams.text}
            </a>
        );
    }
}

Button.propTypes = { btnParams: PropTypes.object };
