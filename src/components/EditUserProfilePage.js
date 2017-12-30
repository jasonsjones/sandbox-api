import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import editUserProfileStore from '../stores/editUserProfileStore';
import * as editProfileActions from '../actions/editProfileActions';
import AvatarUpload from './AvatarUpload';
import InputTextElement from './InputTextElement';
import DeleteUserModal from './DeleteUserModal';

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
            showModal: false
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
            showModal: false
        });
        editProfileActions.deleteUserAccount(this.props.user.id);
    }

    render() {
        return (
            <div className="slds-grid">
                <div className="container-content">
                    <h1 className="slds-text-heading_large slds-text-align_center">Edit User Profile Page</h1>
                    <div className="slds-m-top_large">
                        <div className="slds-m-bottom_large">
                            <img style={avatarStyles} src={this.props.user.avatarUrl}/>
                        </div>
                        <AvatarUpload/>
                    </div>
                    <hr/>
                    <form className="slds-form slds-form_stacked" onSubmit={this.handleSubmit}>
                        <InputTextElement type="text" name="name" label="Name" variant="large" value={this.state.name} handleChange={this.handleChange}/>
                        <InputTextElement type="text" name="email" label="Email" variant="large" value={this.state.email} handleChange={this.handleChange}/>
                        <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center slds-m-top_medium">
                            <Link to="/profile">
                                <button type='button' className="slds-button slds-button_neutral">Cancel</button>
                            </Link>
                            <button type='button' className="slds-button slds-button_destructive" onClick={() => this.setState({showModal: true})}>Delete Account</button>
                            <button type='submit' className="slds-button slds-button_brand">Submit</button>
                        </div>
                    </form>
                    {this.state.showModal && <DeleteUserModal title="Delete User Account?"
                                                    onCancel={() => this.setState({showModal: false})}
                                                    onDelete={this.handleDeleteUser}/>}
                    {this.state.userUpdated && <Redirect to='/profile'/>}
                </div>
            </div>
        );
    }

}

export default EditUserProfilePage;
