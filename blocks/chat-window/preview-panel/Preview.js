import React, { Component } from 'react';
import FilePreview from 'react-preview-file';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Preview.css';

import { deleteAttachment, resetAttachments } from '../../../actions/activeChat';
import { showFullSize } from '../../../actions/modals';

class Preview extends Component {
    deletePic = e => {
        const index = e.target.parentElement.getAttribute('data-id');

        this.props.deleteAttachment(parseInt(index, 10));
    }

    /* eslint-disable react/no-array-index-key */
    /* eslint-disable react/jsx-closing-bracket-location */
    previewImgs(attachments) {
        return attachments.map((attachment, i) => {
            return (
                <FilePreview key={attachment.file.name + String(i)} file={attachment.file}>
                    {preview => {
                        return (
                            <li
                                key={attachment.file.name + String(i)}
                                className="preview"
                                data-id={i}
                                >
                                <img
                                    src={preview}
                                    className="preview__item"
                                    onClick={this.props.showFullSize}
                                    draggable="false"
                                />
                                <img
                                    src="/static/closeDeleteElement.svg"
                                    className="preview__item_delete"
                                    title="Удалить элемент"
                                    onClick={this.deletePic}
                                    draggable="false"
                                />
                            </li>
                        );
                    }}
                </FilePreview>
            );
        });
    }

    render() {
        const { attachments } = this.props;

        if (!attachments || attachments.length === 0) {
            return <div className="img-preview" />;
        }

        return (
            <div className={
                'preview-place grid_' +
                `${this.props.isForward
                    ?
                    '3_5'
                    :
                    '4_6'}`
            }>
                <img
                    src="/static/clear_attachments.svg"
                    onClick={this.props.resetAttachments}
                    draggable="false"
                    className="preview-place_clear"
                />
                <div className="load-preview">
                    {this.previewImgs(attachments)}
                </div>
            </div>
        );
    }
}

Preview.propTypes = {
    attachments: PropTypes.array,
    deleteAttachment: PropTypes.func,
    showFullSize: PropTypes.func,
    resetAttachments: PropTypes.func,

    isForward: PropTypes.bool
};

export default connect(
    state => ({
        attachments: state.activeChat.attachments
    }), {
        deleteAttachment,
        showFullSize,
        resetAttachments
    }
)(Preview);
