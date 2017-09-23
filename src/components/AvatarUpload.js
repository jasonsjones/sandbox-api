import React from 'react';

import * as avatarUploadActions from '../actions/avatarUploadActions';

class AvatarUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newAvatarFile: null
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
    }

    handleAvatarChange(e) {
        e.preventDefault();
        let fileList = e.target.files;
        this.setState({
            newAvatarFile: fileList[0]
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

    render() {
        return (
            <form className="slds-form slds-form_stacked">
                <div className="slds-form-element">
                    <span className="slds-form-element__label" id="file-selector-primary-label">Change Avatar</span>
                    <div className="slds-form-element__control">
                        <div className="slds-file-selector slds-file-selector_files">
                            <div className="slds-file-selector__dropzone">
                                <input type="file" className="slds-file-selector__input slds-assistive-text" onChange={this.handleAvatarChange}
                                    accept="image/png, image/jpg" id="file-upload-input" name="avatar"
                                    aria-labelledby="file-selector-primary-label file-selector-secondary-label" />
                                <label className="slds-file-selector__body" htmlFor="file-upload-input" id="file-selector-secondary-label">
                                    <span className="slds-file-selector__button slds-button slds-button_neutral">
                                        <svg className="slds-button__icon slds-button__icon_left" aria-hidden="true">
                                            <use xlinkHref="styles/design-system/assets/icons/utility-sprite/svg/symbols.svg#upload" />
                                        </svg>Upload New Avatar</span>
                                    <span className="slds-file-selector__text slds-medium-show">or Drop Files</span>
                                </label>
                            </div>
                        </div>
                        {this.state.newAvatarFile && (
                            <div>
                                <div className="slds-m-top_large slds-m-left_medium">
                                    <p className="slds-text-color_weak">Selected Avatar: </p>
                                    <p>{this.state.newAvatarFile.name} <span className="slds-m-left_x-large">{this.returnFileSize(this.state.newAvatarFile.size)}</span></p>
                                </div>
                                <button className="slds-button slds-button_brand slds-m-top_medium" onClick={this.handleAvatarSubmit}>Change</button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        );
    }
}

export default AvatarUpload;
