'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './FullSize.css';
import { hideFullSize } from '../../../actions/modals';

class FullSize extends Component {
    render() {
        const fullSizeImg = this.props.fullSizeImg || '';

        if (!fullSizeImg.length) {
            return null;
        }

        return (
            <div className="darkness" onClick={this.props.hideFullSize}>
                <img
                    src={fullSizeImg}
                    className="full-size__img"
                    draggable="false"
                />
            </div>
        );
    }
}

FullSize.propTypes = {
    fullSizeImg: PropTypes.string,
    hideFullSize: PropTypes.func
};

export default connect(
    state => ({
        fullSizeImg: state.modal.fullSizeImg
    }), {
        hideFullSize
    }
)(FullSize);
