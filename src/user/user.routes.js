import multer from 'multer';
import * as UserController from './user.controller';

export default (app) => {

    const upload = multer({dest: './uploads/'});

    app.get('/api/users', UserController.getUsers);

    app.get('/api/user/:id', UserController.getUser);

    app.delete('/api/user/:id', UserController.deleteUser);

    app.post('/api/signup', UserController.signupUser);

    app.post('/api/user/:userid/avatar', authenticate, upload.single('avatar'), UserController.uploadUserAvatar);

    app.post('/api/login', UserController.loginUser);

    function authenticate(req, res, next) {
        let token = req.body.token || req.headers['x-token'];
        console.log('this resource is protected by jwt');
        console.log(token);
        next();
    }
}
