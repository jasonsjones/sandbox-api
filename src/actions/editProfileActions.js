import AppDispatcher from '../dispatcher';

import * as dataservice from './dataservice';

export function updateUserProfile(newUserData) {
    AppDispatcher.handleViewAction({
        actionType: 'UPDATE_USER_PROFILE',
        data: true
    });

    console.log('New User Data: ');
    console.log(newUserData);

    dataservice.updateUserProfile(newUserData)
        .then(data => {
            console.log('going to make PATCH call to: ');
            console.log(data);
            AppDispatcher.handleViewAction({
                actionType: "UPDATE_USER_PROFILE_SUCCESS",
                data: true
            });
        })
        .catch(err => {
            AppDispatcher.handleViewAction({
                actionType: "UPDATE_USER_PROFILE_ERROR",
                data: err
            });
        });

}
