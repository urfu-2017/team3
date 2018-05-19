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
            <div className="emoji">
                <Picker
                    set="emojione"
                    onSelect={addEmoji}
                    emoji="point_up"
                    showPreview={false}
                    showSkinTones={false}
                    include={['people']}
                    emojiSize={20}
                    sheetSize={32}
                    autoFocus
                />
            </div>
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
