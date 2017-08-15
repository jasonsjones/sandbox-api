import fs from 'fs';
import Avatar from './avatar.model';

export function getAvatars(queryConditions = {}) {
    return new Promise((resolve, reject) => {
        Avatar.find(queryConditions).exec()
            .then(avatars => {
                resolve(avatars);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function getAvatar(id) {
    if (id === 'default') {
        return Promise.resolve(getDefaultAvatar());
    } else {
        return Promise.resolve(getAvatarById(id));
    }
}

export function uploadAvatar(file) {
    let avatar = new Avatar();
    avatar.contentType = file.mimetype;
    avatar.fileSize = file.size / 1000;
    avatar.defaultImg = false;
    avatar.data = fs.readFileSync(file.path);
    fs.unlinkSync(file.path);
    return Promise.resolve(avatar.save());

}

function getDefaultAvatar() {
    return Avatar.findOne({defaultImg: true}).exec();
}
function getAvatarById(id) {
    return Avatar.findById(id).exec();
}
