import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as authAction from '../actions/authActions';

const avatarStyles = {
    borderRadius: "50%",
    width: "200px"
}

class UserProfilePage extends React.Component {

    static propTypes = {
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            avatarUrl: PropTypes.string.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        authAction.logoutUser();
    }

    render() {
        const { user } = this.props;
        const buttonText = (user.hasSFDCProfile) ? 'Unlink SFDC Profile' : 'Link SFDC Profile';

        return (
            <div className="slds-m-around_x-large container-content container-content_narrow">
                <h1 className="slds-text-heading_large slds-text-align_center">User Profile Page</h1>

                <div className="slds-grid slds-grid_align-space slds-m-vertical_large">
                    <div>
                        <img style={avatarStyles} src={user.avatarUrl}/>
                    </div>
                    <div className="slds-grid slds-grid--vertical">
                        <h3 className="slds-text-heading_medium">{user.name}</h3>
                        <p className="slds-text-body_regular slds-text-color_weak slds-m-top_medium">{user.email}</p>
                    </div>
                </div>

                <div className="slds-grid slds-grid_align-spread slds-m-top_large">
                    <button className="slds-button slds-button_neutral" onClick={this.handleClick}>Logout</button>
                    <Link to="/editprofile">
                        <button className="slds-button slds-button_brand">Edit Profile</button>
                    </Link>
                    {/* this button does not do anything yet.  TODO: add onClick to initiate
                        the correct action whether or the not the user is already linked  */}
                    <button className="slds-button slds-button_brand">{buttonText}</button>
                </div>
            </div>
        );
    }
}

export default UserProfilePage;
