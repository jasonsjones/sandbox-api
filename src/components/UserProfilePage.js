import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as authAction from '../actions/authActions';

const avatarStyles = {
    borderRadius: "50%",
    width: "200px"
}

class UserProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        authAction.logoutUser();
    }

    render() {
        const { user } = this.props;

        return (
            <div className="slds-m-around_x-large container-content">
                <h1 className="slds-text-heading_large slds-text-align_center">User Profile Page</h1>

                <div className="slds-grid slds-m-top_large">
                    <div className="slds-m-bottom_large">
                        <img style={avatarStyles} src={this.props.user.avatarUrl}/>
                    </div>
                    <div className="slds-grid slds-grid--vertical slds-m-left_large">
                        <h3 className="slds-text-heading_medium">{user.name}</h3>
                        <p className="slds-text-body_regular slds-text-color_weak slds-m-top_medium">{user.email}</p>
                    </div>
                </div>

                <div className="slds-grid slds-grid_align-spread slds-m-top_large">
                    <button className="slds-button slds-button_neutral" onClick={this.handleClick}>Logout</button>
                    <Link to="/editprofile">
                        <button className="slds-button slds-button_brand">Edit Profile</button>
                    </Link>
                </div>
            </div>
        );
    }
}

UserProfilePage.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired
    })
};

export default UserProfilePage;
