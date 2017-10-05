import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import AvatarUpload from './AvatarUpload';
import InputTextElement from './InputTextElement';
import './EditUserProfilePage.css';

class EditUserProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            email: this.props.user.email
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        console.log('submitting the update');
    }

    render() {
        return (
            <div className="slds-grid">
                <div className="editProfileForm">
                    <h1 className="slds-text-heading_large">Edit User Profile Page</h1>
                    <div className="slds-m-top_large">
                        <span className="slds-avatar slds-avatar_large slds-m-right_large">
                            <img src={this.props.user.avatarUrl}/>
                        </span>
                        <AvatarUpload/>
                    </div>
                    <form className="slds-form slds-form_stacked" onSubmit={this.handleSubmit}>
                        <InputTextElement type="text" name="name" label="Name" value={this.state.name} handleChange={this.handleChange}/>
                        <InputTextElement type="text" name="email" label="Email" value={this.state.email} handleChange={this.handleChange}/>
                        <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center slds-m-top_medium">
                            <button type='submit' className="slds-button slds-button_brand">Submit</button>
                            <Link to="/">
                                <button type='button' className="slds-button slds-button_brand">Cancel</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

EditUserProfilePage.propTypes = {
    user: PropTypes.object
};

export default EditUserProfilePage;
