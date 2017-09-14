import EventEmitter from 'events';
import AppDispatcher from '../dispatcher';

class SignupStore extends EventEmitter {
    constructor() {
        super();
        this.signingUp = false;
        this.signupComplete = false;
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

    getSignupStatus() {
        return this.signingUp;
    }

    getSignupCompleteStatus() {
        return this.signupComplete;
    }

    handleActions(action) {
        let payload = action.action;
        switch(payload.actionType) {
            case 'SIGNUP_USER':
                this.signingUp = true;
                this.emitChange();
                break;
            case 'SIGNUP_USER_SUCCESS':
                this.signingUp = false;
                this.signupComplete = true;
                this.emitChange();
                break;
            default:
                break;
        }
    }
}

const signupStore = new SignupStore();
AppDispatcher.register(signupStore.handleActions.bind(signupStore));

export default signupStore;
