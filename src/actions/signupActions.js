import AppDispatcher from '../dispatcher';
import * as dataservice from './dataservice';

export function signupUser(user) {
    AppDispatcher.handleViewAction({
        actionType: 'SIGNUP_USER',
        data: true
    });

    dataservice.signupUser(user)
        .then(response => {
            if (response.success) {
                AppDispatcher.handleViewAction({
                    actionType: 'SIGNUP_USER_SUCCESS',
                    data: true
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}
