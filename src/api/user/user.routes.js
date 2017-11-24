import multer from 'multer';
import * as UserController from './user.controller';
// import * as AuthController from '../common/auth.controller';

export default (app) => {

    const upload = multer({dest: './uploads/'});

    app.get('/api/users',
            //  AuthController.verifyToken,
            //  AuthController.adminRoute,
             UserController.getUsers);

    app.get('/api/user/:id', UserController.getUser);
    app.put('/api/user/:id', UserController.updateUser);
    app.delete('/api/user/:id', UserController.deleteUser);

    app.post('/api/signup', UserController.signupUser);

    app.post('/api/user/:userid/avatar',
            //   AuthController.verifyToken,
            //   AuthController.protectRouteByUser,
              upload.single('avatar'),
              UserController.uploadUserAvatar
    );
}
