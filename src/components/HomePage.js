import React from 'react';
import PropTypes from 'prop-types';

import * as authAction from '../actions/authActions';
import AvatarUpload from './AvatarUpload';

class Home extends React.Component {
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
                <h1 className="slds-text-heading_large">Home page!</h1>
                <h3 className="slds-text-heading_medium slds-m-bottom_large">Hello, {user.name}</h3>
                <span className="slds-avatar slds-avatar_large slds-m-right_large">
                    <img src={user.avatarUrl}/>
                </span>
                <button className="slds-button slds-button_neutral" onClick={this.handleClick}>Logout</button>

                <div className="slds-m-top_large">
                    <AvatarUpload/>
                </div>

            </div>
        );
    }
}

Home.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired
    })
};

export default Home;
