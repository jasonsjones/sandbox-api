import React from 'react';
import { Redirect } from 'react-router-dom';

import * as signupActions from '../actions/signupActions';
import signupStore from '../stores/signupStore';
import InputTextElement from './InputTextElement';
import './SignupPage.css';

export default class SignupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            doPasswordsMatch: true,
            isSigningUp: signupStore.getSignupStatus(),
            isSignupComplete: signupStore.getSignupCompleteStatus()
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentWillMount() {
        signupStore.addChangeListenter(this.updateState);
    }

    componentWillUnmount() {
        signupStore.removeChangeListener(this.updateState);
    }

    updateState() {
        this.setState({
            isSigningUp: signupStore.getSignupStatus(),
            isSignupComplete: signupStore.getSignupCompleteStatus()
        });
    }

    handleChange(e) {
        const value = e.target.value;
        const name = e.target.name;
        this.setState({
            [name]: value
        }, () => {
            if (this.state.confirmPassword) {
                this.setState({
                    doPasswordsMatch: this.verifyPasswords()
                });
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }

        if (this.verifyPasswords()) {
            this.resetForm();
            signupActions.signupUser(newUser);
        }
    }

    resetForm() {
        this.setState({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    }

    verifyPasswords() {
        return this.state.password === this.state.confirmPassword;
    }

    render() {
        let button;
        if (this.state.isSigningUp) {
            button = <button type='submit' className="slds-button slds-button_neutral slds-m-top_medium">Signing Up...</button>
        } else {
            button = <button type='submit' className="slds-button slds-button_brand slds-m-top_medium">Sign Up</button>
        }
        return (
            <div className="slds-grid slds-grid--vertical">
                <div className="signupform">
                    <h1 className="slds-text-heading_large">Signup for free account</h1>
                    <form className="slds-form slds-form_stacked" onSubmit={this.handleSubmit}>
                        <InputTextElement type="text" name="name" label="Name" value={this.state.name} handleChange={this.handleChange} />
                        <InputTextElement type="text" name="email" label="Email" value={this.state.email} handleChange={this.handleChange} />
                        <InputTextElement type="password" name="password" label="Password" value={this.state.password} handleChange={this.handleChange} />
                        <InputTextElement type="password" name="confirmPassword" label="Confirm Password" value={this.state.confirmPassword} handleChange={this.handleChange} />
                        {button}
                    </form>
                    {this.state.isSignupComplete && (
                        <Redirect to="/login"/>
                    )}
                </div>
            </div>
        );
    }
}
