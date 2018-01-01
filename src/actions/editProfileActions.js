import AppDispatcher from '../dispatcher';

import * as dataservice from './dataservice';

export function updateUserProfile(newUserData) {
    AppDispatcher.handleViewAction({
        actionType: 'UPDATE_USER_PROFILE',
        data: true
    });

    dataservice.updateUserProfile(newUserData)
        .then(response => {
            if (response.success) {
                let user = response.payload.user;
                let token = response.payload.token
                AppDispatcher.handleViewAction({
                    actionType: "UPDATE_USER_PROFILE_SUCCESS",
                    data: {
                        user,
                        token
                    }
                });
            }
        })
        .catch(err => {
            AppDispatcher.handleViewAction({
                actionType: "UPDATE_USER_PROFILE_ERROR",
                data: err
            });
        });
}

export function deleteUserAccount(id) {
    AppDispatcher.handleViewAction({
        actionType: "LOGOUT_USER"
    });
    dataservice.deleteUserAccount(id)
        .then(response => {
            if (response.success) {
                let user = null;
                AppDispatcher.handleViewAction({
                    actionType: "UPDATE_USER_PROFILE_SUCCESS",
                    data: {
                        user
                    }
                });
            }
        })
        .catch(err => {
            AppDispatcher.handleViewAction({
                actionType: "UPDATE_USER_PROFILE_ERROR",
                data: err
            });
        });
}
