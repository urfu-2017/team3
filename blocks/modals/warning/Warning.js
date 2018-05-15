'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './Warning.css';
import { hideWarning } from '../../../actions/modals';

class Warning extends Component {
    render() {
        const text = this.props.text || '';

        if (!text.length) {
            return null;
        }

        return (
            <div className="darkness" onClick={this.props.hideWarning}>
                <div className="warning">{text}</div>
            </div>
        );
    }
}

Warning.propTypes = {
    text: PropTypes.string,
    hideWarning: PropTypes.func
};

export default connect(
    state => ({
        text: state.modal.warning
    }), {
        hideWarning
    }
)(Warning);
