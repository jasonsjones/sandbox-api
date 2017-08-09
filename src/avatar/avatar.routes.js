import multer from 'multer';
import * as AvatarController from './avatar.controller';

export default (app) => {

    const upload = multer({dest: './uploads/'});

    app.route('/api/avatar')
        .get(AvatarController.getAvatars)
        .post(upload.single('avatar'), AvatarController.uploadAvatar);

    app.route('/api/avatar/:id')
        .get(AvatarController.getAvatar);
}
