import EventEmitter from 'events';
import AppDispatcher from '../dispatcher';

class AuthStore extends EventEmitter {
    constructor() {
        super();

        this.currentUser = null;
        this.token = null;
        this.errorMsg = '';
        this.loggingIn = false;
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
        let user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
        return this.currentUser;
    }

    getToken() {
        let userToken = localStorage.getItem('userToken');
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

    authenticateUser(data) {
        this.currentUser = data.user;
        this.token = data.token;
        this.errorMsg = '';
        this.loggingIn = false;
        // this is a good place to store the token (if sent from server)
        // and current user data in local or session storage
        localStorage.setItem('userToken', this.token);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.emitChange();
    }

    authenticatUserError(err) {
        this.errorMsg = err;
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

    userLoggingIn() {
        this.loggingIn = true;
        this.emitChange();
    }

    handleActions(action) {
        let payload = action.action;
        switch(payload.actionType) {
            case 'AUTHENTICATE_USER':
                this.authenticateUser(payload.data);
                break;
            case 'LOGOUT_USER':
                this.logoutUser();
                break;
            case 'AUTHENTICATE_USER_ERROR':
                this.authenticatUserError(payload.data);
                break;
            case 'LOGIN_USER_START':
                this.userLoggingIn();
                break;
            default:
        }
    }
}

const authStore = new AuthStore();
AppDispatcher.register(authStore.handleActions.bind(authStore));

export default authStore;
