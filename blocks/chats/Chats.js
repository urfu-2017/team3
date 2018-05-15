'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChatIcon from './ChatIcon';

class Chats extends React.Component {

    endAnimaton = () => {
        document
            .querySelectorAll('.control-img')[1]
            .classList
            .remove('controls_zindex_max');
    }

    componentDidMount() {
        const [, blinkImg] = document.querySelectorAll('.control-img');

        if (this.props.chats.length === 0) {
            blinkImg.classList.add('controls_zindex_max');
        } else {
            blinkImg.classList.remove('controls_zindex_max');
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

        this.componentDidMount();

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
