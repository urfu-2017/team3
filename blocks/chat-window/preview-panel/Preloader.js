'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './Preloader.css';

class Preloader extends Component {
    render() {
        const { isShow } = this.props;

        if (!isShow) {
            return null;
        }

        return (
            <div className="backdrop backdrop_files">
                <div className="loader loader_files">
                    <div className="dot_files" />
                    <div className="dot_files" />
                    <div className="dot_files" />
                    <div className="dot_files" />
                    <div className="dot_files" />
                    <div className="dot_files" />
                    <div className="dot_files" />
                </div>
            </div>
        );
    }
}

Preloader.propTypes = {
    isShow: PropTypes.bool
};

export default connect(
    state => ({
        isShow: state.activeChat.isShowAttachmentPreloader
    })
)(Preloader);
