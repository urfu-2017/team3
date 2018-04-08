'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default class Button extends Component {
    render() {
        const { btnParams } = this.props;

        return (
            <Link className={btnParams.class} href={btnParams.link}>{btnParams.text}</Link>
        );
    }
}

Button.propTypes = { btnParams: PropTypes.object };
