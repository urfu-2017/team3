import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';

import '../../../node_modules/emoji-mart/css/emoji-mart.css';
import { connect } from 'react-redux';

import './Emoji.css';

class Emoji extends Component {
    render() {
        const { showEmoji, addEmoji } = this.props;

        if (!showEmoji) {
            return <div />;
        }

        return (
            <Picker
                set="emojione"
                onSelect={addEmoji}
                emoji="point_up"
                showPreview={false}
                showSkinTones={false}
                search={false}
                include={['people']}
                autoFocus
            />
        );
    }
}

Emoji.propTypes = {
    showEmoji: PropTypes.bool,
    addEmoji: PropTypes.func
};

export default connect(
    state => ({
        showEmoji: state.activeChat && state.activeChat.showEmoji
    })
)(Emoji);
