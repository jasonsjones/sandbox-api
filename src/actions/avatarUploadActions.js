import AppDispatcher from '../dispatcher';

import * as dataservice from './dataservice';

export function uploadNewAvatar(image) {
    dataservice.updateUserAvatar(image)
        .then(response => {
            if (response.success) {
                let currentUser = {
                    id: response.payload.user._id,
                    name: response.payload.user.name,
                    email: response.payload.user.email,
                    avatarUrl: response.payload.user.avatarUrl,
                };
                if (response.payload.user.sfdc) {
                    currentUser.hasSFDCProfile = !!response.payload.user.sfdc.accessToken
                } else {
                    currentUser.hasSFDCProfile = false;
                }
                AppDispatcher.handleViewAction({
                    actionType: "UPDATE_USER_SUCCESS",
                    data: {
                        user: currentUser
                    }
                });
            }

        })
        .catch(err => {
            console.log(err);
        });
}
