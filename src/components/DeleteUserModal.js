import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import closeSvg from 'sldsIcons/utility/close.svg';

const DeleteUserModal = (props) => {
    return (
        <div>
            <section role="dialog" tabIndex="-1" aria-labelledby="modal-heading-01" aria-modal="true" aria-describedby="modal-content-id-1" className="slds-modal slds-fade-in-open">
                <div className="slds-modal__container">
                    <header className="slds-modal__header">
                        <button className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" title="Close" onClick={props.onCancel}>
                            <SVGInline svg={closeSvg} width="32" />
                            <span className="slds-assistive-text">Close</span>
                        </button>
                        <h2 id="modal-heading-01" className="slds-text-heading_medium slds-hyphenate">{props.title}</h2>
                    </header>
                    <div className="slds-modal__content slds-p-around_medium" id="modal-content-id-1">
                        <p>Are you sure you want to delete this user account?</p>
                        <p className="slds-m-top_small">This action cannot be undone.  If you are sure, click the Delete button; otherwise click Cancel</p>
                    </div>
                    <footer className="slds-modal__footer">
                        <button className="slds-button slds-button_neutral" onClick={props.onCancel}>Cancel</button>
                        <button className="slds-button slds-button_destructive" onClick={props.onDelete}>Delete</button>
                    </footer>
                </div>
            </section>
            <div className="slds-backdrop slds-backdrop_open"></div>
        </div>
    );
};

DeleteUserModal.propTypes = {
    title: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default DeleteUserModal;
