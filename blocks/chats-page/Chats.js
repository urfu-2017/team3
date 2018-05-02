'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChatIcon from '../common-components/ChatIcon';

import './Chats.css';

class Chats extends React.Component {
    render() {
        const { chats } = this.props;

        return chats.map(chat => (
            <ChatIcon key={chat.id} chatProps={chat} />
        ));
    }
}

Chats.propTypes = {
    chats: PropTypes.arrayOf(PropTypes.object)
};

export default connect(
    state => ({
        chats: state.chats
    })
)(Chats);
