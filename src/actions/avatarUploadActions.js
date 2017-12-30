import AppDispatcher from '../dispatcher';

import * as dataservice from './dataservice';

export function uploadNewAvatar(image) {
    dataservice.updateUserAvatar(image)
        .then(response => {
            if (response.success) {
                let user = response.payload.user;
                AppDispatcher.handleViewAction({
                    actionType: "UPDATE_USER_SUCCESS",
                    data: {
                        user
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}
