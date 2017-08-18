import * as AvatarRepository from './avatar.repository';

export function getAvatars(req, res) {
    AvatarRepository.getAvatars({}, '-data')
        .then(avatars => {
            res.json({
                success: true,
                data: avatars
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error retrieving avatars'
            });
        });
}

export function getAvatar(req, res) {
    AvatarRepository.getAvatar(req.params.id)
        .then(avatar => {
            res.contentType(avatar.contentType);
            res.write(avatar.data);
            res.end();
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'error retrieving avatar'
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

