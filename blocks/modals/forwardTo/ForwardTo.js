'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { hideContacts } from '../../../actions/activeChat';

import ChatIcon from '../../chats/ChatIcon';

import './ForwardTo.css';

/* eslint-disable react/jsx-closing-bracket-location */

class ForwardTo extends Component {
    hideContacts = () => {
        this.props.hideContacts();
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideContacts();
            }
        });
    }

    render() {
        const { chats, isShowContacts } = this.props;

        if (!isShowContacts) {
            return null;
        }

        return (
            <div
                className="darkness"
                onClick={this.hideContacts}
                >
                <div
                    className="forward-chooser_wrapper"
                    >
                    <div className="forward-chooser">
                        { chats.map(contact => {
                            return (
                                <ChatIcon
                                    key={contact._id}
                                    chatProps={contact}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

ForwardTo.propTypes = {
    chats: PropTypes.array,
    isShowContacts: PropTypes.bool,
    hideContacts: PropTypes.func
};

export default connect(
    state => ({
        chats: state.chats,
        isShowContacts: state.activeChat && state.activeChat.isShowContacts
    }),
    {
        hideContacts
    }
)(ForwardTo);
