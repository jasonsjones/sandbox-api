import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import authStore from '../stores/authStore';

import LoginPage from './LoginPage';
import UserProfilePage from './UserProfilePage';
import SignupPage from './SignupPage';
import EditUserProfilePage from './EditUserProfilePage';
import './App.css';

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
        let user = this.state.currentUser;
        let isAuthenticated = this.isUserAuthenticated();
        return (
            <BrowserRouter>
                <div>
                    <Route exact path='/' render={() => (
                        isAuthenticated ? (
                            <UserProfilePage user={user}/>
                        ) : (
                            <Redirect to='/login'/>
                        )
                    )}/>
                    <Route exact path='/profile' render={() => (
                        isAuthenticated ? (
                            <UserProfilePage user={user}/>
                        ) : (
                            <Redirect to='/login'/>
                        )
                    )}/>
                    <Route exact path='/login' render={() => (
                        !isAuthenticated ? (
                            <LoginPage/>
                        ) : (
                            <Redirect to='/profile'/>
                        )
                    )}/>
                    <Route exact path='/signup' render={()=><SignupPage/>}/>
                    <Route exact path='/editprofile' render={() => (
                        isAuthenticated ? (
                            <EditUserProfilePage user={user}/>
                        ) : (
                            <Redirect to='/login'/>
                        )
                    )}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
