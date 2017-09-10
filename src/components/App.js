import React from 'react';

import authStore from '../stores/authStore';

import LoginPage from './LoginPage';
import HomePage from './HomePage';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: authStore.getCurrentUser(),
            token: authStore.getToken()
        };

        this.isUserAuthenticated = this.isUserAuthenticated.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentWillMount() {
        authStore.addChangeListenter(this.updateUser);
    }

    componentWillUnmount() {
        authStore.removeChangeListener(this.updateUser);
    }

    updateUser() {
        this.setState({
            currentUser: authStore.getCurrentUser(),
            token: authStore.getToken()
        });
    }

    isUserAuthenticated() {
        return !!this.state.token;
    }

    render() {
        return (
            <div>
                {this.isUserAuthenticated() ? (
                    <HomePage user={this.state.currentUser} />
                    ) : (
                    <LoginPage isAuthenticated={this.isUserAuthenticated()} />
                )}
            </div>
        );
    }
}

export default App;
