import EventEmitter from 'events';
import AppDispatcher from '../dispatcher';

class EditUserProfileStore extends EventEmitter {
    constructor() {
        super();
        this.userUpdated = false;
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

    getUserUpdateStatus() {
        return this.userUpdated;
    }

    handleActions(action) {
        let payload = action.action;
        switch(payload.actionType) {
        case 'UPDATE_USER_PROFILE_SUCCESS':
            this.userUpdated = true;
            this.emitChange();
            break;
        default:
            break;
        }
    }
}

const editUserProfileStore = new EditUserProfileStore();
AppDispatcher.register(editUserProfileStore.handleActions.bind(editUserProfileStore));

export default editUserProfileStore;
