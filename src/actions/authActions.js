import AppDispatcher from '../dispatcher';

export function authenticateUser(user) {
    AppDispatcher.handleViewAction({
        actionType: "AUTHENTICATE_USER",
        data: user
    });
}

export function logoutUser(user) {
    AppDispatcher.handleViewAction({
        actionType: "LOGOUT_USER",
        data: user
    });
}
