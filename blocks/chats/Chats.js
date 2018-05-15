'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChatIcon from './ChatIcon';

class Chats extends React.Component {

    componentDidMount() {
        const [, blinkImg] = document.querySelectorAll('.control-img');

        if (this.props.chats.length === 0) {
            blinkImg.classList.add('controls_zindex_max');
            blinkImg.addEventListener('mouseup', e => {
                e.target.classList.remove('controls_zindex_max');
            });
        }
    }

    render() {
        const { chats } = this.props;

        if (chats.length === 0) {
            return (
                <React.Fragment>
                    <div className="darkness" />
                    <div className="chats__no-chats" />
                </React.Fragment>
            );
        }

        return chats.map(chat => (
            <ChatIcon key={chat._id} chatProps={chat} />
        ));
    }
}

Chats.propTypes = {
    chats: PropTypes.array
};

export default connect(
    state => ({
        chats: state.chats
    })
)(Chats);
