import React from 'react';
import PropTypes from 'prop-types';

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

class Toast extends React.Component {
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
        let rootClasses = `slds-notify_container slds-is-absolute ${hideClass}`;
        return (
            <div className={rootClasses}>
                <div className="slds-notify slds-notify_toast slds-theme_info" role="alert">
                    <Icon/>
                    <div className="slds-notify__content">
                        <h2 className="slds-text-heading_small">
                            Test message in a default Toast. <a href="javascript:void(0);">We can include links...</a>
                        </h2>
                    </div>
                    <ToastButtonClose onClose={this.closeToast} />
                </div>
            </div>
        );
    }
}

Toast.propTypes = {
    onClose: PropTypes.func
}

export default Toast;
