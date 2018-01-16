import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import authStore from '../stores/authStore';
import * as authactions from '../actions/authActions';

import LoginPage from './LoginPage';
import UserProfilePage from './UserProfilePage';
import SignupPage from './SignupPage';
import EditUserProfilePage from './EditUserProfilePage';
import Spinner from './Spinner';
import './App.css';
import 'sldsCss';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: authStore.getCurrentUser(),
            token: authStore.getToken(),
            isFetching: authStore.getLoginStatus()
        };

        this.isUserAuthenticated = this.isUserAuthenticated.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentWillMount() {
        authStore.addChangeListenter(this.updateUser);
        authactions.getSessionUser();
    }

    componentWillUnmount() {
        authStore.removeChangeListener(this.updateUser);
    }

    updateUser() {
        this.setState({
            currentUser: authStore.getCurrentUser(),
            token: authStore.getToken(),
            isFetching: authStore.getLoginStatus()
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
                        ) : ( !this.state.isFetching
                                ? <Redirect to='/login'/>
                                : <Spinner />
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
