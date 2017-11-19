import * as AvatarRepository from './avatar.repository';

export function getAvatars(req, res, next) {
    AvatarRepository.getAvatars({}, '-data')
        .then(avatars => {
            res.json({
                success: true,
                data: avatars
            });
            next(null);
        })
        .catch(err => {
            res.status(500);
            res.json({
                success: false,
                message: 'error retrieving avatars'
            });
            next(err);
        });
}

export function getAvatar(req, res, next) {
    AvatarRepository.getAvatar(req.params.id)
        .then(avatar => {
            res.contentType(avatar.contentType);
            res.write(avatar.data);
            res.end();
            next(null);
        })
        .catch(err => {
            res.status(500);
            res.json({
                success: false,
                message: 'error retrieving avatar'
            });
            next(err);
        });
}

export function deleteAvatar(req, res) {
    AvatarRepository.deleteAvatar(req.params.id)
        .then(avatar => {
            res.json({
                success: true,
                message: 'avatar successfully deleted',
                payload: avatar
            })
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error deleting avatar'
            });
        });
}

export function uploadAvatar(req, res) {
    AvatarRepository.uploadAvatar(req.file)
        .then((img) => {
            res.json({
                success: true,
                message: 'avatar uploaded and saved',
                payload: {
                    avatar: img
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error saving avatar'
            });
        });
}

