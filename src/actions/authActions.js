import AppDispatcher from '../dispatcher';

import * as dataservice from './dataservice';

export function authenticateUser(user) {
    AppDispatcher.handleViewAction({
        actionType: 'AUTHENTICATE_USER',
        data: true
    });
    dataservice.getAuthUser(user)
        .then(data => {
            if (data.success) {
                let user = data.payload.user;
                let token = data.payload.token
                AppDispatcher.handleViewAction({
                    actionType: "AUTHENTICATE_USER_SUCCESS",
                    data: {
                        user,
                        token
                    }
                });
            }
        })
        .catch(err => {
            AppDispatcher.handleViewAction({
                actionType: "AUTHENTICATE_USER_ERROR",
                data: err
            });
        });
}

export function logoutUser(user) {
    window.location = "http://localhost:3000/api/signout";
    AppDispatcher.handleViewAction({
        actionType: "LOGOUT_USER",
        data: user
    });
}

export function getSessionUser() {
    AppDispatcher.handleServerAction({
        actionType: 'AUTHENTICATE_USER'
    });
    dataservice.getSessionUser()
        .then(data => {
            if (data.success) {
                let user = data.payload.user;
                let token = data.payload.token
                AppDispatcher.handleViewAction({
                    actionType: "AUTHENTICATE_USER_SUCCESS",
                    data: {
                        user,
                        token
                    }
                });
            }
            AppDispatcher.handleServerAction({
                actionType: 'GET_SESSION_USER_COMPLETE'
            });
        })
        .catch(err => {
            AppDispatcher.handleViewAction({
                actionType: "AUTHENTICATE_USER_ERROR",
                data: err
            });
        });
}
