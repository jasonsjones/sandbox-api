import AppDispatcher from '../dispatcher';

import * as dataservice from './dataservice';

export function authenticateUser(user) {
    AppDispatcher.handleViewAction({
        actionType: 'AUTHENTICATE_USER',
        data: true
    });
    dataservice.getAuthUser(user)
        .then(data => {
            let currentUser = {
                id: data.payload.user._id,
                name: data.payload.user.name,
                email: data.payload.user.email,
                avatarUrl: data.payload.user.avatarUrl
            };
            let token = data.payload.token
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
