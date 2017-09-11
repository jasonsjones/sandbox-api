import React from 'react';
import PropTypes from 'prop-types';

import * as authAction from '../actions/authActions';

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
                <h3 className="slds-text-heading_medium">Hello, {user.name}</h3>
                <button className="slds-button slds-button_neutral slds-m-top_medium" onClick={this.handleClick}>Logout</button>
            </div>
        );
    }
}

Home.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired
    })
};

export default Home;
