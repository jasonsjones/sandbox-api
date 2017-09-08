import AppDispatcher from '../dispatcher';

import * as dataservice from './dataservice';

export function authenticateUser(user) {
    AppDispatcher.handleViewAction({
        actionType: 'AUTHENTICATE_USER',
        data: true
    });
    dataservice.getAuthUser(user)
        .then(theUser => {
            let currentUser = {
                name: theUser.name,
                email: theUser.email
            };
            let token = 'jwt.token.fromServer';
            AppDispatcher.handleViewAction({
                actionType: "AUTHENTICATE_USER_SUCCESS",
                data: {
                    user: currentUser,
                    token: token
                }
            });
        })
        .catch(err => {
            AppDispatcher.handleViewAction({
                actionType: "AUTHENTICATE_USER_ERROR",
                data: err
            });
        });
}

export function logoutUser(user) {
    AppDispatcher.handleViewAction({
        actionType: "LOGOUT_USER",
        data: user
    });
}
