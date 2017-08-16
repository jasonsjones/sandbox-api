import User from './user.model';

export function getUsers(queryCondition = {}) {
    return Promise.resolve(User.find(queryCondition).exec());
}

export function getUser(id) {
    return Promise.resolve(User.findById(id).exec());
}

export function deleteUser(id) {
    return Promise.resolve(User.findByIdAndRemove(id).exec());
}
