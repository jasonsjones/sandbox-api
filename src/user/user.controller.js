import fs from 'fs';
import User from './user.model';
import Avatar from '../avatar/avatar.model';
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
    let userPromise = User.findOne({_id: req.params.userid}).exec();

    let avatarPromise = userPromise.then(user => {
        let avatar = makeAvatar(req, user._id);
        return avatar.save();
    });

    Promise.all([userPromise, avatarPromise]).then(values => {
        let [user, img] = values;
        fs.unlinkSync(req.file.path);
        user.avatar = img._id;
        user.avatarUrl = `http://localhost:3000/api/avatar/${img._id}`;
        return user.save();
    }).then(user => {
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
    let newUser = new User(req.body);
    newUser.save()
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


function makeAvatar(req, userId) {
    let avatar = new Avatar();
    avatar.fileName = req.file.originalname;
    avatar.contentType = req.file.mimetype;
    avatar.fileSize = req.file.size / 1000;
    avatar.defaultImg = false;
    avatar.data = fs.readFileSync(req.file.path);
    avatar.user = userId;
    return avatar;
}
