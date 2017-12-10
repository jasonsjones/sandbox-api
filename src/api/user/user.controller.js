import * as UserRepository from './user.repository';

export function getUsers() {
    return UserRepository.getUsers()
        .then(users => {
            return {
                success: true,
                payload: {
                    users
                }
            };
        })
        .catch(err => {
            return Promise.reject({
                success: false,
                message: `error getting users: ${err.message}`,
                error: err
            });
        });
}

export function getUser(req) {
    if (!req || !req.params || !req.params.id) {
        return Promise.reject({
            success: false,
            message: 'Missing required request parameter',
            error: new Error('Missing required request paramater')
        });
    }
    return UserRepository.getUser(req.params.id)
        .then(user => {
            return {
                success: true,
                payload: {
                    user
                }
            };
        })
        .catch(err => {
            return {
                success: false,
                message: `error getting user: ${err.message}`,
                error: err
            };
        });
}

export function updateUser(req) {
    if (!req || !req.params || !req.params.id || !req.body) {
        return Promise.reject({
            success: false,
            message: 'Missing required request parameter',
            error: new Error('Missing required request paramater')
        });
    }
    return UserRepository.updateUser(req.params.id, req.body)
        .then(user => {
            return {
                success: true,
                message: 'user updated',
                payload: {
                    user
                }
            };
        })
        .catch(err => {
            return {
                success: false,
                message: `error updating user: ${err.message}`,
                error: err
            };
        });
}

export function deleteUser(req) {
    if (!req || !req.params || !req.params.id) {
        return Promise.reject({
            success: false,
            message: 'Missing required request parameter',
            error: new Error('Missing required request paramater')
        });
    }
    return UserRepository.deleteUser(req.params.id)
        .then(user => {
            return user.remove();
        })
        .then(user => {
            return {
                success: true,
                message: 'user removed',
                payload: {
                    user
                }
            };
        })
        .catch(err => {
            return {
                success: false,
                message: `error removing user: ${err.message}`,
                error: err
            };
        });
}

export function uploadUserAvatar(req) {
    if (!req || !req.params || !req.params.userid || !req.file) {
        return Promise.reject({
            success: false,
            message: 'Missing required request parameter',
            error: new Error('Missing required request paramater')
        });
    }
    return UserRepository.uploadUserAvatar(req.params.userid, req.file)
        .then(user => {
            return {
                success: true,
                message: 'avatar uploaded and saved',
                payload: {
                    user
                }
            };
        })
        .catch(err => {
            return {
                success: false,
                message: `error uploading avatar: ${err.message}`,
                error: err
            };
        });
}

export function signupUser(req) {
    if (!req || !req.body) {
        return Promise.reject({
            success: false,
            message: 'Missing required request parameter',
            error: new Error('Missing required request paramater')
        });
    }
    return UserRepository.signUpUser(req.body)
        .then(user => {
            return {
                success: true,
                message: 'new user saved',
                payload: {
                    name: user.name,
                    email: user.email
                }
            };
        })
        .catch(err => {
            return {
                success: false,
                message: `error saving new user: ${err.message}`,
                error: err
            };
        });
}
