import React, { Component } from 'react';
import FilePreview from 'react-preview-file';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Preview.css';

class Preview extends Component {
    deletePic = e => {
        const id = e.target.parentElement.getAttribute('data-id');

        const { attachments } = this.props;
        const { attachmentsLinks } = this.props;

        attachments.splice(id, 1);
        attachmentsLinks.splice(id, 1);

        this.props.deleteAttachment(attachments, attachmentsLinks);
    }

    previewImgs(files) {
        return files.map((file, i) => {
            return (
                <FilePreview key={file.name} file={file}>
                    {preview => {
                        return (
                            <li key={file.name} className="preview" data-id={i}>
                                <img
                                    src={preview}
                                    className="preview__item"
                                />
                                <img
                                    src="/static/closeDeleteElement.svg"
                                    className="preview__item_delete"
                                    onClick={this.deletePic}
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
            <div className="load-preview">
                {this.previewImgs(attachments)}
            </div>
        );
    }
}

Preview.propTypes = {
    attachments: PropTypes.array,
    attachmentsLinks: PropTypes.array,
    deleteAttachment: PropTypes.func
};

export default connect(
    state => ({
        attachments: state.activeChat.attachments,
        attachmentsLinks: state.activeChat.attachmentsLinks
    }),
    dispatch => ({
        deleteAttachment: (attachments, attachmentsLinks) => {
            dispatch({ type: 'DELETE_ATTACHMENT', attachments, attachmentsLinks });
        }
    })
)(Preview);
