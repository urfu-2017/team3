'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './Loader.css';

class Loader extends Component {
    render() {
        const { show } = this.props;

        if (!show) {
            return null;
        }

        return (
            <div className="darkness">
                <div className="backdrop">
                    <div className="loader">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                    </div>
                </div>
            </div>
        );
    }
}

Loader.propTypes = {
    show: PropTypes.bool
};

export default connect(
    state => ({
        show: state.loader.show
    })
)(Loader);
