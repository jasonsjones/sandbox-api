import * as UserRepository from './user.repository';

export function getUsers(req, res) {
    UserRepository.getUsers()
        .then(users => {
            res.json({
                success: true,
                payload: users
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error getting user'
            });
        });
}

export function getUser(req, res) {
    UserRepository.getUser(req.params.id)
        .then(user => {
            res.json({
                success: true,
                payload: user
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error getting user'
            });
        });
}

export function deleteUser(req, res) {
    UserRepository.deleteUser(req.params.id)
        .then(user => {
            return user.remove();
        })
        .then(user => {
            res.json({
                success: true,
                message: 'user removed',
                payload: user
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error removing user'
            });
        });
}

export function uploadUserAvatar(req, res) {
    UserRepository.uploadUserAvatar(req.params.userid, req.file)
        .then(user => {
            res.json({
                success: true,
                message: 'avatar uploaded and saved',
                payload: user
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error uploading avatar'
            });
        });
}

export function signupUser(req, res) {
    UserRepository.signUpUser(req.body)
        .then(user => {
            res.json({
                success: true,
                message: 'new user saved',
                payload: user
            })
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error saving new user'
            });
        });
}
