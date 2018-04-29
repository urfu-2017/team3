import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import EmojiPicker from 'react-emoji-picker';
// import './Preview.css';

export default class Emoji extends Component {

    // getInitialState = () => {
    //     return {
    //         emoji: null,
    //         showEmojiPicker: false
    //     };
    // }

    // onEmojiCkick = (code, data) => {
    //     console.log(code, data);
    // }

    // setEmoji = emoji => {
    //     this.setState({ emoji });
    // }

    render() {
        const { showEmoji } = this.props;
        // console.log(showEmoji);

        if (!showEmoji) {
            return <div />;
        }

        // const emojiPickerStyles = {
        //     position: 'absolute',
        //     left: 0, top: '3.9rem',
        //     backgroundColor: 'white',
        //     width: '100%',
        //     padding: '.3em .6em',
        //     border: '1px solid #0074d9',
        //     borderTop: 'none',
        //     zIndex: '2'
        // };

        return (
            <div className="emoji">
                {/* <EmojiPicker
                    style={emojiPickerStyles} onSelect={this.setEmoji}
                    query={this.state.emoji}
                /> */}
            </div>
        );
    }
}

Emoji.propTypes = {
    showEmoji: PropTypes.bool
};
