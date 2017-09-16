import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import InputTextElement from './InputTextElement';
import authStore from '../stores/authStore';
import * as authAction from '../actions/authActions';
import './LoginPage.css';

const Icon = () => {
    return (
        <div>
        <span className="slds-assistive-text">info</span>
        <span className="slds-icon_container slds-icon-utility-info slds-m-right_small slds-no-flex slds-align-top"
            title="Description of icon when needed">
            <svg className="slds-icon slds-icon_small" aria-hidden="true">
                <use xlinkHref="styles/design-system/assets/icons/utility-sprite/svg/symbols.svg#info" />
            </svg>
        </span>
        </div>
    );
}

const ToastButtonClose = (props) => {
    return (
        <button className="slds-button slds-button_icon slds-notify__close slds-button_icon-inverse" onClick={props.onClose} title="Close">
            <svg className="slds-button__icon slds-button__icon_large" aria-hidden="true">
                <use xlinkHref="styles/design-system/assets/icons/utility-sprite/svg/symbols.svg#close" />
            </svg>
            <span className="slds-assistive-text">Close</span>
        </button>
    );
}

ToastButtonClose.propTypes = {
    onClose: PropTypes.func
}

const Toast = (props) => {
    return (
        <div className="slds-notify_container slds-is-absolute">
            <div className="slds-notify slds-notify_toast slds-theme_info" role="alert">
                <Icon/>
                <div className="slds-notify__content">
                    <h2 className="slds-text-heading_small">
                        Test message in a default Toast. <a href="javascript:void(0);">We can include links...</a>
                    </h2>
                </div>
                <ToastButtonClose onClose={props.onClose} />
            </div>
        </div>
    );
}

Toast.propTypes = {
    onClose: PropTypes.func
}

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

const LoginForm = (props) => {
    let button;
    if (props.value.isLoggingIn) {
        button = <button type='submit' className="slds-button slds-button_neutral slds-m-top_medium loginButton">Logging in...</button>
    } else {
        button = <button type='submit' className="slds-button slds-button_brand slds-m-top_medium loginButton">Log In</button>
    }

    return (
        <form className="slds-form slds-form_stacked" onSubmit={props.handleSubmit}>
            <InputTextElement type="text" name="email" label="Email"
                value={props.value.email} handleChange={props.handleChange} />
            <InputTextElement type="password" name="password" label="Password"
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
            isLoggingIn: false,
            showToast: true
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.closeToast = this.closeToast.bind(this);
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

    closeToast() {
        this.setState({
            showToast: false
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

    render() {
        let errorText = null;
        if (this.state.errorMsg) {
            errorText = <p className="slds-text-color_error slds-text-heading_small slds-m-top_medium">
                        {this.state.errorMsg}</p>
        }

        return (
            <div className="slds-grid slds-grid--frame slds-grid--pull-padded-medium"
                ref={(element) => { this.loginForm = element }}>
                <div className="slds-size--1-of-2 slds-p-horizontal--medium loginform-left">
                {this.state.showToast && <Toast onClose={this.closeToast}/>}
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
                        <Link to="/signup">
                            <button type='button' className="slds-button slds-button_neutral tryButton">Try for Free</button>
                        </Link>
                    </div>
                    </div>
                </div>
                <div className="slds-size--1-of-2 slds-p-horizontal--medium loginpage-right">
                </div>
            </div>
        );
    }
}

LoginForm.propTypes = {
    showToast: PropTypes.bool
}
