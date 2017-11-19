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

export function deleteAvatar(req) {
    return AvatarRepository.deleteAvatar(req.params.id)
        .then(avatar => {
            return {
                success: true,
                message: 'avatar successfully deleted.',
                payload: avatar
            };
        })
        .catch(err => {
            return {
                success: false,
                message: 'error deleting avatar. ' + err,
                error: err
            };
        });
}

export function uploadAvatar(req) {
    return AvatarRepository.uploadAvatar(req.file)
        .then(avatar => {
            return {
                success: true,
                message: 'avatar uploaded and saved.',
                payload: {
                    avatar
                }
            }
        })
        .catch(err => {
            return {
                success: false,
                message: 'error saving avatar. ' + err,
                error: err
            };
        });
}

