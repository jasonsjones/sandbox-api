import multer from 'multer';
import * as UserController from './user.controller';
import * as AuthController from '../common/auth.controller';

export default (app) => {

    const upload = multer({dest: './uploads/'});

    app.get('/api/users', UserController.getUsers);

    app.get('/api/user/:id', UserController.getUser);

    app.delete('/api/user/:id', UserController.deleteUser);

    app.post('/api/signup', UserController.signupUser);

    app.post('/api/user/:userid/avatar',
              AuthController.protectRoute,
              upload.single('avatar'),
              UserController.uploadUserAvatar
    );

    app.post('/api/login', AuthController.loginUser);
}
