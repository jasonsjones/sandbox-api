import React from 'react';

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
        return (
            <div className="slds-m-around_x-large">
                <h1 className="slds-text-heading_large">Home page!</h1>
                <h3 className="slds-text-heading_medium">Hello, {this.props.user.name}</h3>
                <button className="slds-button slds-button_neutral slds-m-top_medium" onClick={this.handleClick}>Logout</button>
            </div>
        );
    }
}

export default Home;
