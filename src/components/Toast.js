import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import closeSvg from 'sldsIcons/utility/close.svg';
import infoSvg from 'sldsIcons/utility/info.svg';
import successSvg from 'sldsIcons/utility/success.svg';
import warningSvg from 'sldsIcons/utility/warning.svg';
import errorSvg from 'sldsIcons/utility/error.svg';

const ToastIcon  = (props) => {
    let themeSvg;
    switch (props.theme) {
        case 'info':
            themeSvg = infoSvg;
            break;
        case 'success':
            themeSvg = successSvg;
            break;
        case 'warning':
            themeSvg = warningSvg;
            break;
        case 'error':
            themeSvg = errorSvg;
            break;
    }

    return (
        <div>
            <span className="slds-assistive-text">{props.theme}</span>
            <span className="slds-icon_container slds-icon-utility-info slds-m-right_small slds-no-flex slds-align-top"
                title={`${props.theme} icon`}>
                <SVGInline svg={themeSvg} width="28" />
            </span>
        </div>
    );
}

ToastIcon.propTypes = {
    theme: PropTypes.string
}

const ToastButtonClose = (props) => {
    return (
        <button className="slds-button slds-button_icon slds-notify__close slds-button_icon-inverse" onClick={props.onClose} title="Close">
            <SVGInline svg={closeSvg} width="28" />
            <span className="slds-assistive-text">Close</span>
        </button>
    );
}

ToastButtonClose.propTypes = {
    onClose: PropTypes.func
}

class Toast extends React.Component {

    static propTypes = {
        theme: PropTypes.string.isRequired,
        children: PropTypes.element.isRequired,
        onClose: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            showToast: true
        };

        this.closeToast = this.closeToast.bind(this);
    }

    closeToast() {
        this.setState({
            showToast: false
        });
    }

    render() {
        let hideClass = (!this.state.showToast) ? 'slds-hide' : '';
        return (
            <div className={`slds-notify_container slds-is-absolute ${hideClass}`}>
                <div className={`slds-notify slds-notify_toast slds-theme_${this.props.theme}`} role="alert">
                    <ToastIcon theme={this.props.theme}/>
                    <div className="slds-notify__content">
                        {this.props.children}
                    </div>
                    <ToastButtonClose onClose={this.closeToast} />
                </div>
            </div>
        );
    }
}

export default Toast;
