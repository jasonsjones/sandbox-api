import User from './user.model';
import { makeAvatarModel } from '../avatar/avatar.repository';

export function getUsers(queryCondition = {}) {
    return Promise.resolve(User.find(queryCondition).exec());
}

export function getUser(id) {
    return Promise.resolve(User.findById(id).exec());
}

export function deleteUser(id) {
    return Promise.resolve(User.findByIdAndRemove(id).exec());
}

export function updateUser(id, userData) {
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
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

export function uploadUserAvatar(id, file) {
    return new Promise((resolve, reject) => {
        let userPromise = getUser(id);
        let avatarPromise = userPromise.then(user => {
            let avatar = makeAvatarModel(file, user._id)
            return avatar.save();
        });
        Promise.all([userPromise, avatarPromise]).then(values => {
            let [user, img] = values;
            user.avatar = img._id;
            user.avatarUrl = `http://localhost:3000/api/avatar/${img._id}`;
            resolve(user.save());
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

export function signUpUser(userData) {
    let newUser = new User(userData);
    return Promise.resolve(newUser.save());
}