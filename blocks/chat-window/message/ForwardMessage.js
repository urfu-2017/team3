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
/* eslint-disable react/jsx-closing-bracket-location */

class ForwardMessage extends Component {
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

        const { author, date, text, meta, attachments, forwardFrom } = this.props.message;
        const newText = this.formatText(text);
        const goodDate = this.prettyDate(date);
        const metadata = this.formatMeta(meta);
        const images = this.formatImages(attachments);

        return (
            <div className={'message__body message__body_' +
                `${this.props.my ? 'my' : 'friend'}`}
                >
                <div className="message__data">
                    <span className="message__sender">{author}</span>
                    <span className="message__date">{goodDate}</span>
                </div>
                <div className="message__forward_content">
                    <div className="message__data">
                        <span className="message__sender">{forwardFrom}</span>
                        <span className="message__date">{goodDate}</span>
                    </div>
                    <div className="message__content">{newText}</div>
                    <div className="message__attachments">
                        {images}
                    </div>
                    {metadata}
                </div>
            </div>
        );
    }
}

ForwardMessage.propTypes = {
    message: PropTypes.object,
    my: PropTypes.bool,
    showFullSize: PropTypes.func
};

export default connect(
    () => ({}), {
        showFullSize
    }
)(ForwardMessage);
