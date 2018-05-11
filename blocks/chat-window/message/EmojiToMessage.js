import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';

import '../../../node_modules/emoji-mart/css/emoji-mart.css';
import { connect } from 'react-redux';

class Emoji extends Component {
    render() {
        const { showEmojiToMsg, addEmoji } = this.props;

        if (!showEmojiToMsg) {
            return <div />;
        }

        return (
            <Picker
                set="emojione"
                onSelect={addEmoji}
                emoji="point_up"
                showPreview={false}
                showSkinTones={false}
                autoFocus
                include={['people']}
                emojiSize={20}
            />
        );
    }
}

Emoji.propTypes = {
    showEmojiToMsg: PropTypes.bool,
    addEmoji: PropTypes.func
};

export default connect(
    state => ({
        showEmoji: state.showEmojiToMsg
    })
)(Emoji);
