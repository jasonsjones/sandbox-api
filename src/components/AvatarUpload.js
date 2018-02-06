import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import * as avatarUploadActions from '../actions/avatarUploadActions';
import deleteSvg from 'sldsIcons/utility/delete.svg';
import upload from 'sldsIcons/utility/upload.svg';

class AvatarUpload extends React.Component {

    static propTypes = {
        onUpload: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            newAvatarFile: null,
            previewSrc: 'https://dummyimage.com/180x180/6b6d70/aaa.png'
        };

        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.handleAvatarSubmit = this.handleAvatarSubmit.bind(this);
        this.returnFileSize = this.returnFileSize.bind(this);
    }

    handleAvatarSubmit(e) {
        e.preventDefault();
        avatarUploadActions.uploadNewAvatar(this.state.newAvatarFile);
        this.setState({
            newAvatarFile: null
        });
        this.props.onUpload();
    }

    handleAvatarChange(e) {
        e.preventDefault();
        let fileList = e.target.files;
        this.setState({
            newAvatarFile: fileList[0]
        }, () => {
            this.renderPreviewImage();
        });
    }

    resetState = () => {
        this.setState({
            newAvatarFile: null,
            previewSrc: 'https://dummyimage.com/180x180/6b6d70/aaa.png'
        });
    }

    returnFileSize(number) {
        if(number < 1024) {
            return number + 'bytes';
        } else if(number > 1024 && number < 1048576) {
            return (number/1024).toFixed(1) + 'KB';
        } else if(number > 1048576) {
            return (number/1048576).toFixed(1) + 'MB';
        }
    }

    renderChangeButton() {
        const { newAvatarFile } = this.state;
        return (
            <div className="slds-m-top_large">
                <p className="slds-text-color_weak">Selected Avatar: </p>
                <div className="slds-grid slds-grid_vertical-align-center">
                    <div>{newAvatarFile.name}</div>
                    <div className="slds-m-left_x-large">{this.returnFileSize(newAvatarFile.size)}</div>
                    <div style={{cursor: 'pointer'}}
                        title="Remove selected image file" className="slds-m-left_large slds-m-bottom_small"
                        onClick={this.resetState}>
                        <SVGInline svg={deleteSvg} fill='#333' width='16' height='16' cleanup={true}/>
                        <span className="slds-assistive-text">Remove selected image file</span>
                    </div>
                </div>
                <button className="slds-button slds-button_brand slds-m-top_x-large" onClick={this.handleAvatarSubmit}>Change Image</button>
            </div>
        );
    }

    renderFileSelector() {
        return (
            <div className="slds-file-selector slds-file-selector_images" style={{width: '180px', height: '180px'}}>
                <div className="slds-file-selector__dropzone">
                    <input type="file" className="slds-file-selector__input slds-assistive-text" onChange={this.handleAvatarChange}
                        accept="image/png, image/jpg" id="file-upload-input" name="avatar"
                        aria-labelledby="file-selector-primary-label file-selector-secondary-label" />
                    <label className="slds-file-selector__body" htmlFor="file-upload-input" id="file-selector-secondary-label">
                        <span className="slds-file-selector__button slds-button slds-button_neutral">
                            <SVGInline className="slds-m-right_xx-small slds-m-bottom_xx-small" fill='#0070d2' svg={upload} width='16' height='16' cleanup={true}/>
                            Upload New Avatar
                        </span>
                        <span className="slds-file-selector__text slds-medium-show">or Drop Files</span>
                    </label>
                </div>
            </div>
        );
    }

    renderPreviewImage() {
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({
                previewSrc: reader.result
            });
        };
        reader.readAsDataURL(this.state.newAvatarFile);
    }

    render() {
        return (
            <div className="slds-grid slds-grid_align-space">
                <form className="slds-form slds-form_stacked">
                    <div className="slds-form-element">
                        <span className="slds-form-element__label" id="file-selector-primary-label">Change Avatar</span>
                        <div className="slds-form-element__control">
                            {!this.state.newAvatarFile && this.renderFileSelector()}
                        </div>
                        {this.state.newAvatarFile && this.renderChangeButton()}
                    </div>
                </form>
                <img style={{width: '180px', height: '180px', marginTop: '1.5rem', borderRadius: '50%'}} src={this.state.previewSrc} alt="preview image"/>
            </div>
        );
    }
}

export default AvatarUpload;
