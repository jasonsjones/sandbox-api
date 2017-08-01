import multer from 'multer';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import User from './user.model';
import Avatar from '../avatar/avatar.model';

export default (app) => {

    const upload = multer({dest: './uploads/'});
    app.get('/api/users', (req, res) => {
        User.find({}).exec()
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
    });

    app.get('/api/user/:id', (req, res) => {
        User.findOne({_id: req.params.id}).exec()
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
    });

    app.delete('/api/user/:id', (req, res) => {
        User.findOne({_id: req.params.id}).exec()
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
    });

    app.post('/api/signup', (req, res) => {
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
    });

    app.post('/api/user/:userid/avatar', authenticate, upload.single('avatar'), (req, res) => {
        let userPromise = User.findOne({_id: req.params.userid}).exec();

        let avatarPromise = userPromise.then(user => {
            let avatar = new Avatar();
            avatar.fileName = req.file.originalname;
            avatar.contentType = req.file.mimetype;
            avatar.defaultImg = false;
            avatar.data = fs.readFileSync(req.file.path);
            avatar.user = user._id;
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
                message: 'avatar uploaded',
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
    });

    app.post('/api/login', (req, res) => {
        User.findOne({email: req.body.email}).exec()
            .then(user => {
                if (user.verifyPassword(req.body.password)) {
                    let token = jwt.sign(user._id, 'SECRET', {
                        expiresIn: '24hr'
                    });
                    res.json({
                        success: true,
                        message: 'user authenticated',
                        payload: {
                            user,
                            token
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'invalid username or password',
                        payload: null
                    });
                }
            })
            .catch(err => {
                res.json({
                    success: false,
                    message: 'user not found',
                    payload: null
                });
            });
    });

    function authenticate(req, res, next) {
        let token = req.body.token || req.headers['x-token'];
        console.log('this resource is protected by jwt');
        console.log(token);
        next();
    }
}
