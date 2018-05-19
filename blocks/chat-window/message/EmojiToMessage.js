import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';

import '../../../node_modules/emoji-mart/css/emoji-mart.css';
import { connect } from 'react-redux';

class Emoji extends Component {
    hideEmoji = () => {
        this.props.hideEmoji();
    }

    componentDidUpdate() {
        const picker = document.querySelector('.emoji_wrapper');

        if (!picker) {
            return;
        }
        picker.focus();
    }

    render() {
        const { showEmojiToMsg, addEmoji } = this.props;

        if (!showEmojiToMsg) {
            return <div />;
        }

        return (
            <div className="emoji_wrapper" onBlur={this.hideEmoji} tabIndex="0">
                <Picker
                    set="emojione"
                    onSelect={addEmoji}
                    emoji="point_up"
                    showPreview={false}
                    showSkinTones={false}
                    include={['people']}
                    emojiSize={20}
                    sheetSize={32}
                />
            </div>
        );
    }
}

Emoji.propTypes = {
    showEmojiToMsg: PropTypes.bool,
    addEmoji: PropTypes.func,
    hideEmoji: PropTypes.func
};

export default connect(
    state => ({
        showEmoji: state.showEmojiToMsg
    })
)(Emoji);
