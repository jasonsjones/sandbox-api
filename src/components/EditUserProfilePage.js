import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import editUserProfileStore from '../stores/editUserProfileStore';
import * as editProfileActions from '../actions/editProfileActions';
import AvatarUpload from './AvatarUpload';
import InputTextElement from './InputTextElement';
import DeleteUserModal from './DeleteUserModal';

import closeSvg from 'sldsIcons/utility/close.svg';

const AvatarModal = (props) => {
    return (
        <div>
            <section role="dialog" tabIndex="-1" aria-labelledby="modal-heading-01" aria-modal="true"
                     aria-describedby="modal-content-id-1" className="slds-modal slds-fade-in-open">
                <div className="slds-modal__container">
                    <header className="slds-modal__header">
                        <button className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" onClick={props.onCancel} title="Close">
                            <SVGInline svg={closeSvg} width="32" />
                            <span className="slds-assistive-text">Close</span>
                        </button>
                        <h2 id="modal-heading-01" className="slds-text-heading_medium slds-hyphenate">Change Profile Picture</h2>
                    </header>
                    <div className="slds-modal__content slds-p-around_medium" id="modal-content-id-1">
                        <AvatarUpload onUpload={props.onCancel}/>
                    </div>
                    <footer className="slds-modal__footer">
                        <button className="slds-button slds-button_neutral" onClick={props.onCancel}>Cancel</button>
                    </footer>
                </div>
            </section>
            <div className="slds-backdrop slds-backdrop_open"></div>
        </div>
    );
}

AvatarModal.propTypes = {
    onCancel: PropTypes.func.isRequired
}

const avatarStyles = {
    borderRadius: "50%"
}

class EditUserProfilePage extends React.Component {

    static propTypes = {
        user: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            email: this.props.user.email,
            userUpdated: editUserProfileStore.getUserUpdateStatus(),
            showDeleteModal: false,
            showAvatarModal: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);

        this.updateState = this.updateState.bind(this);
    }

    componentWillMount() {
        editUserProfileStore.addChangeListenter(this.updateState);
    }

    componentWillUnmount() {
        editUserProfileStore.removeChangeListener(this.updateState);
    }

    updateState() {
        this.setState({
            userUpdated: editUserProfileStore.getUserUpdateStatus()
        });
    }

    handleChange(e) {
        const value = e.target.value;
        const name = e.target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        editProfileActions.updateUserProfile({name: this.state.name, email: this.state.email});
    }

    handleDeleteUser() {
        this.setState({
            showDeleteModal: false
        });
        editProfileActions.deleteUserAccount(this.props.user.id);
    }

    render() {
        return (
            <div className="container-content container-content_wide">
                <h1 className="slds-text-heading_large slds-text-align_center">Edit User Profile Page</h1>

                <div className="slds-grid slds-grid_vertical-align-center">

                    <div className="slds-col">
                        <div className="slds-m-top_large">
                            <div className="slds-grid slds-grid_align-center slds-m-bottom_large">
                                <img style={avatarStyles} src={this.props.user.avatarUrl}/>
                            </div>
                        </div>
                        <div className="slds-grid slds-grid_align-center">
                            <button type='button' className="slds-button slds-button_brand"
                                    onClick={() => this.setState({showAvatarModal: true})}>Change Profile Picture</button>
                        </div>
                    </div>

                    <div className="slds-col">
                        <form className="slds-form slds-form_stacked" onSubmit={this.handleSubmit}>
                            <InputTextElement type="text" name="name" label="Name" variant="large" value={this.state.name} handleChange={this.handleChange}/>
                            <InputTextElement type="text" name="email" label="Email" variant="large" value={this.state.email} handleChange={this.handleChange}/>
                            <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center slds-m-top_medium">
                                <Link to="/profile">
                                    <button type='button' className="slds-button slds-button_neutral">Cancel</button>
                                </Link>
                                <button type='button' className="slds-button slds-button_destructive" onClick={() => this.setState({showDeleteModal: true})}>Delete Account</button>
                                <button type='submit' className="slds-button slds-button_brand">Submit</button>
                            </div>
                        </form>
                    </div>

                </div>
                {this.state.showAvatarModal && <AvatarModal onCancel={() => this.setState({showAvatarModal: false})}/>}
                {this.state.showDeleteModal && <DeleteUserModal title="Delete User Account?"
                                                onCancel={() => this.setState({showDeleteModal: false})}
                                                onDelete={this.handleDeleteUser}/>}
                {this.state.userUpdated && <Redirect to='/profile'/>}
            </div>
        );
    }

}

export default EditUserProfilePage;
