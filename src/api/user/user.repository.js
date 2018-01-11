import User from './user.model';
import { deleteAvatar, makeAvatarModel } from '../avatar/avatar.repository';

export function getUsers(queryCondition = {}, inclAvatars = false) {
    return new Promise((resolve, reject) => {
        let query;
        if (inclAvatars) {
            query = User.find(queryCondition).populate('avatar', '-data');
        } else {
            query = User.find(queryCondition);
        }

        query.exec()
            .then(users => resolve(users))
            .catch(err => reject(err));
    });
}

export function getUser(id, inclAvatar = false) {
    if (!id) {
        return Promise.reject(new Error('user id is required'));
    }
    return new Promise((resolve, reject) => {
        let query;
        if (inclAvatar) {
            query = User.findById(id).populate('avatar', '-data');
        } else {
            query = User.findById(id);
        }

        query.exec()
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}

export function lookupUserByEmail(email, inclAvatar = false) {
    if (!email) {
        return Promise.reject(new Error('email is required'));
    }
    return new Promise((resolve, reject) => {
        let query;
        if (inclAvatar) {
            query = User.findOne({email: email}).populate('avatar', '-data');
        } else {
            query = User.findOne({email: email});
        }

        query.exec()
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}

export function deleteUser(id) {
    if (!id) {
        return Promise.reject(new Error('user id is required'));
    }
    return new Promise((resolve, reject) => {
        User.findByIdAndRemove(id).exec()
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}

export function updateUser(id, userData) {
    if (!id) {
        return Promise.reject(new Error('user id is required'));
    }
    if (!userData) {
        return Promise.reject(new Error('userData is required'));
    }
    return new Promise((resolve, reject) => {
        User.findById(id).exec()
            .then(user => {
                for (let prop in userData) {
                    if (user[prop]) {
                        user[prop] = userData[prop];
                    }
                }
                resolve(user.save());
            })
            .catch(err => reject(err));
            });
}

export function uploadUserAvatar(id, file, deleteAfterUpload = true) {
    if (!id) {
        return Promise.reject(new Error('user id is required'));
    }
    if (!file) {
        return Promise.reject(new Error('avatar file is required'));
    }
    return new Promise((resolve, reject) => {
        let userPromise = getUser(id);

        // if the user already has a custom avatar image, delete it first
        userPromise.then(user => {
            if (user.hasCustomAvatar()) {
                deleteAvatar(user.avatar);
            }
        });

        let avatarPromise = userPromise.then(user => {
            let avatar = makeAvatarModel(file, user._id, deleteAfterUpload);
            return avatar.save();
        });

        Promise.all([userPromise, avatarPromise]).then(values => {
            let [user, img] = values;
            user.avatar = img._id;
            user.avatarUrl = `http://localhost:3000/api/avatar/${img._id}`;
            resolve(user.save());
        })
        .catch(err => reject(err));
    });
}

export function changePassword(userData) {
    if (!userData) {
        return Promise.reject(new Error('user data is required'));
    }

    const { email, currentPassword, newPassword } = userData;

    if (!email || !currentPassword || !newPassword) {
        return Promise.reject(new Error('user email is required'));
    }

    return this.lookupUserByEmail(email, false)
        .then(user => {
            if (user.verifyPassword(currentPassword)) {
                user.password = newPassword;
                return user.save();
            } else {
                return Promise.reject(new Error('user unauthorized to change password'));
            }
        });
}

export function signUpUser(userData) {
    if (!userData) {
        return Promise.reject(new Error('user data is required'));
    }
    let newUser = new User(userData);
    return newUser.save();
}

export const unlinkSFDCAccount = (user) => {
    if (!user) {
        return Promise.reject(new Error('User not provided; unable to unlink'));
    }
    user.sfdc.accessToken = null;
    user.sfdc.refreshToken = null;
    user.sfdc.profile = {};
    return user.save();
}
