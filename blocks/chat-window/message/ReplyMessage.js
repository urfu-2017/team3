'use strict';

import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';

import { showFullSize } from '../../../actions/modals';

import './ReplyMessage.css';

/* eslint-disable react/no-array-index-key */

class ReplyMessage extends Component {
    prettyDate(date) {
        return moment(date)
            .locale('ru')
            .format('LT');
    }

    formatText(text) {
        return text.split(/:(\+?[0-9a-z_-]+):/).map((chunk, i) => {
            if (i % 2) {
                return (
                    <Emoji
                        key={i}
                        emoji={chunk}
                        set="emojione"
                        size={20}
                    />
                );
            }

            return (
                <ReactMarkdown
                    renderers={{ root: 'span', paragraph: 'span' }}
                    key={i}
                    source={chunk}
                />
            );
        });
    }

    formatImages(attachments) {
        return attachments.map((link, i) => {
            return (
                <img
                    className="message__attachment"
                    src={link}
                    key={i}
                    onClick={this.props.showFullSize}
                    draggable="false"
                />
            );
        });
    }

    formatMeta(meta) {
        return (
            Object.keys(meta || {}).length === 0
                ?
                    <React.Fragment />
                :
                (
                    <a className="reply__metalink" href={meta.url}>
                        <h3 className="reply__metalink_name">{meta.title || meta.author}</h3>
                    </a>
                )
        );
    }

    render() {
        if (!this.props.message) {
            return null;
        }

        const { author, date, text, meta, attachments } = this.props.message;
        const newText = this.formatText(text);
        const goodDate = this.prettyDate(date);
        const metadata = this.formatMeta(meta);
        const images = this.formatImages(attachments);

        return (
            <div className="reply">
                <div className="reply__data">
                    <span className="reply__sender">{author}</span>
                    <span className="reply__date">{goodDate}</span>
                </div>
                <div className="reply__content">{newText}</div>
                <div className="reply__attachments">
                    {images}
                </div>
                {metadata}
            </div>
        );
    }
}

ReplyMessage.propTypes = {
    message: PropTypes.object,
    showFullSize: PropTypes.func
};

export default connect(
    () => ({}), {
        showFullSize
    }
)(ReplyMessage);
