import EventEmitter from 'events';
import AppDispatcher from '../dispatcher';

class AuthStore extends EventEmitter {
    constructor() {
        super();

        this.currentUser = null;
        this.token = null;
        this.errorMsg = '';
        this.loggingIn = false;
        this.fetchUserRequired = false;
    }

    addChangeListenter(callback) {
        this.on('change', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

    emitChange() {
        this.emit('change');
    }

    getCurrentUser() {
        const { user } = this.getDataFromLocalStorage();
        if (user) {
            this.currentUser = JSON.parse(user);
        }
        return this.currentUser;
    }

    getToken() {
        const { userToken } = this.getDataFromLocalStorage();
        if (userToken) {
            this.token = userToken;
        }
        return this.token;
    }

    getErrorMessage() {
        return this.errorMsg;
    }

    getLoginStatus() {
        return this.loggingIn;
    }

    getDataFromLocalStorage() {
        return {
            user: localStorage.getItem('currentUser'),
            userToken: localStorage.getItem('userToken')
        };
    }

    isFetchUserRequired() {
        return this.isFetchUserRequired;
    }

    authenticateUser(data) {
        this.loggingIn = false;
        this.currentUser = data.user;
        this.token = data.token;
        this.errorMsg = '';
        // this is a good place to store the token (if sent from server)
        // and current user data in local or session storage
        localStorage.setItem('userToken', this.token);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.emitChange();
    }

    authenticatUserError(err) {
        this.errorMsg = err.message;
        this.loggingIn = false;
        this.emitChange();
    }

    logoutUser() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        this.token = '';
        this.currentUser = {};
        this.emitChange();
    }

    setFetchUserStatus(status) {
        console.log('changing fetch user status to ', status);
        this.fetchUserRequired = status;
        this.emitChange();
    }

    userLoggingIn() {
        this.loggingIn = true;
        this.emitChange();
    }

    updateUser(data) {
        this.currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.emitChange();
    }

    handleActions(action) {
        let payload = action.action;
        switch(payload.actionType) {
        case 'AUTHENTICATE_USER':
        case 'GET_SESSION_USER':
            this.userLoggingIn();
            break;
        case 'AUTHENTICATE_USER_SUCCESS':
            this.authenticateUser(payload.data);
            break;
        case 'AUTHENTICATE_USER_ERROR':
            this.authenticatUserError(payload.data);
            break;
        case 'UPDATE_USER_SUCCESS':
        case 'UPDATE_USER_PROFILE_SUCCESS':
            this.updateUser(payload.data);
            break;
        case 'GET_SESSION_USER_COMPLETE':
            this.loggingIn = false;
            this.setFetchUserStatus(false);
            break;
        case 'LOGOUT_USER':
            this.logoutUser();
            break;
        case 'INITIATE_OAUTH_FLOW':
            this.setFetchUserStatus(true);
            break;
        default:
        }
    }
}

const authStore = new AuthStore();
AppDispatcher.register(authStore.handleActions.bind(authStore));

export default authStore;
