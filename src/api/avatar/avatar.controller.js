import * as AvatarRepository from './avatar.repository';

export function getAvatars() {
    return AvatarRepository.getAvatars({}, '-data')
        .then(avatars => {
            return {
                success: true,
                data: avatars
            };
        })
        .catch(err => {
            return {
                success: false,
                message: 'error retrieving avatars. ' + err,
                error: err
            }
        });
}

export function getAvatar(req) {
    return AvatarRepository.getAvatar(req.params.id)
        .then(avatar => {
            return {
                contentType: avatar.contentType,
                data: avatar.data
            };
        })
        .catch(err => {
            return {
                success: false,
                message: 'error retrieving avatar. ' + err,
                error: err
            }
        });
}

// TODO: need to promisify
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

// TODO: need to promisify
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

