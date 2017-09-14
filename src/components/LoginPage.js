import React from 'react';
import PropTypes from 'prop-types';

import authStore from '../stores/authStore';
import * as authAction from '../actions/authActions';
import './LoginPage.css';

const CheckBox = () => {
    return (
        <div className="slds-form-element">
            <div className="slds-form-element__control">
                <span className="slds-checkbox">
                    <input type="checkbox" name="options" id="checkbox-1" value="on" />
                    <label className="slds-checkbox__label" htmlFor="checkbox-1">
                        <span className="slds-checkbox_faux"></span>
                        <span className="slds-form-element__label">Remember Me</span>
                    </label>
                </span>
            </div>
        </div>
    );
}

const InputElement = (props) => {
    return (
        <div className="slds-form-element slds-m-top_medium">
            <label className="slds-form-element__label" htmlFor={props.name}>{props.label}</label>
            <div className="slds-form-control__control">
                <input className="slds-input loginform-text-input" type={props.type} id={props.name} name={props.name}
                    value={props.value} onChange={props.handleChange} />
            </div>
        </div>
    );
}

InputElement.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired
};

const LoginForm = (props) => {
    let button;
    if (props.value.isLoggingIn) {
        button = <button type='submit' className="slds-button slds-button_neutral slds-m-top_medium loginButton">Logging in...</button>
    } else {
        button = <button type='submit' className="slds-button slds-button_brand slds-m-top_medium loginButton">Log In</button>
    }

    return (
        <form className="slds-form slds-form_stacked" onSubmit={props.handleSubmit}>
            <InputElement type="text" name="email" label="Email"
                value={props.value.email} handleChange={props.handleChange} />
            <InputElement type="password" name="password" label="Password"
                value={props.value.password} handleChange={props.handleChange} />
            {button}
        </form>
    );
}
LoginForm.propTypes = {
    value: PropTypes.shape({
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        isLoggingIn: PropTypes.bool.isRequired
    }),
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
};

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMsg: '',
            isLoggingIn: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentWillMount() {
        authStore.addChangeListenter(this.updateState);
    }

    componentWillUnmount() {
        authStore.removeChangeListener(this.updateState);
    }

    handleChange(e) {
        const value = e.target.value;
        const name = e.target.name;
        this.setState({
            [name]: value
        });
    }

    updateState() {
        // check ref to loginForm before setting state, otherwise this may get
        // called after the component has been unmounted
        if (this.loginForm) {
            this.setState({
                errorMsg: authStore.getErrorMessage(),
                isLoggingIn: authStore.getLoginStatus()
            });
        }
    }

    resetForm() {
        this.setState({
            password: '',
            errorMsg: ''
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { email, password } = this.state;
        if (!email || !password) {
            this.setState({
                errorMsg: 'Username and password required'
            });
            return;
        }
        authAction.authenticateUser({
            email: this.state.email,
            password: this.state.password
        });
        this.resetForm();
    }

    handleClick(e) {
        e.preventDefault();
        console.log('Logging in with Salesforce...');
    }

    render() {
        let errorText = null;
        if (this.state.errorMsg) {
            errorText = <p className="slds-text-color_error slds-text-heading_small slds-m-top_medium">
                {this.state.errorMsg}
            </p>
        }
        return (
            <div className="slds-grid slds-grid--frame slds-grid--pull-padded-medium"
                ref={(element) => { this.loginForm = element }}>
                <div className="slds-size--1-of-2 slds-p-horizontal--medium loginform-left">
                    <div className="loginform-container">
                    <img className="loginLogo" src="styles/design-system/assets/images/logo-noname.svg" />
                    <div className="slds-m-top_large loginform">
                        {errorText}
                        <LoginForm handleSubmit={this.handleSubmit}
                            handleChange={this.handleChange}
                            value={this.state} />
                        {/* <button type='button' onClick={this.handleClick} className="slds-button slds-button_brand slds-m-top_medium">Salesforce Auth</button> */}
                        <div className="slds-m-top_large">
                            <CheckBox />
                        </div>
                        <hr/>
                        <div className="slds-grid slds-grid_align-spread slds-m-bottom_small">
                            <a href="javascript:void(0)">Forgot Your Password?</a>
                            <a href="javascript:void(0)">Use Custom Domain</a>
                        </div>
                    </div>
                    <div className="slds-grid slds-grid_align-space slds-grid_vertical-align-center slds-m-top_large">
                        <p>Not a Customer?</p>
                        <button type='button' className="slds-button slds-button_neutral tryButton">Try for Free</button>
                    </div>
                    </div>
                </div>
                <div className="slds-size--1-of-2 slds-p-horizontal--medium loginpage-right">
                </div>
            </div>
        );
    }
}
