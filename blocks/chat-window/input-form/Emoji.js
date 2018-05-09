import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';

import '../../../node_modules/emoji-mart/css/emoji-mart.css';
import { connect } from 'react-redux';

class Emoji extends Component {
    render() {
        const { showEmoji, addEmoji } = this.props;

        if (!showEmoji) {
            return <div />;
        }

        const paletteStyle = {
            position: 'absolute',
            bottom: 'calc(48px + 5px)',
            right: 'calc(32px + 16px + 24px)',
            width: '25%',
            minWidth: '300px',
            zIndex: 20
        };

        return (
            <Picker
                set="emojione"
                onSelect={addEmoji}
                emoji="point_up"
                style={paletteStyle}
                showPreview={false}
                showSkinTones={false}
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
