import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as authAction from '../actions/authActions';
import AvatarUpload from './AvatarUpload';

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
            <div className="slds-m-around_x-large">
                <h1 className="slds-text-heading_large">User Profile Page!</h1>
                <h3 className="slds-text-heading_medium">Hello, {user.name}</h3>
                <p className="slds-text-body_regular slds-text-color_weak slds-m-bottom_medium">{user.email}</p>
                <span className="slds-avatar slds-avatar_large slds-m-right_large">
                    <img src={user.avatarUrl}/>
                </span>
                <button className="slds-button slds-button_neutral" onClick={this.handleClick}>Logout</button>

                <div className="slds-m-top_large">
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
