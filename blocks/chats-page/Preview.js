import React, { Component } from 'react';
import FilePreview from 'react-preview-file';
import PropTypes from 'prop-types';
import './Preview.css';

export default class Preview extends Component {
    // deletePic = e => {
    //     const targetPreview = e.target.parentElement;
    //     const previews = document.querySelector('.load-preview').children;
    //     const index = Array.prototype.slice.call(previews).indexOf(targetPreview);

    //     delete this.props.files.splice(index, 1);
    //     this.render();
    // }

    previewImgs(files) {
        return files.map(file => {
            return (
                <FilePreview key={file.name} file={file}>
                    {preview => {
                        return (
                            <li key={file.name} className="preview">
                                <img
                                    src={preview}
                                    className="preview__item"
                                />
                                <img
                                    src="/static/closeDeleteElement.svg"
                                    className="preview__item_delete"
                                    // onClick={this.deletePic}
                                />
                            </li>
                        );
                    }}
                </FilePreview>
            );
        });
    }

    render() {
        const { files } = this.props;

        if (!files || files.length === 0) {
            return <div className="img-preview" />;
        }

        return (
            <div className="load-preview">
                {this.previewImgs(files)}
            </div>
        );
    }
}

Preview.propTypes = {
    files: PropTypes.array
};
