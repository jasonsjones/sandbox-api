import fs from 'fs';
import Avatar from './avatar.model';

export function getAvatars(queryConditions = {}, selectionStr = '') {
    return new Promise((resolve, reject) => {
        Avatar.find(queryConditions, selectionStr).exec()
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
    let avatar = makeAvatarModel(file);
    return Promise.resolve(avatar.save());
}

export function makeAvatarModel(file, userId) {
    let avatar = new Avatar();
    avatar.fileName = file.originalname;
    avatar.contentType = file.mimetype;
    avatar.fileSize = file.size;
    avatar.defaultImg = false;
    avatar.data = fs.readFileSync(file.path);
    fs.unlinkSync(file.path);
    if (userId) {
        avatar.user = userId;
    }
    return avatar;
}

function getDefaultAvatar() {
    return Avatar.findOne({defaultImg: true}).exec();
}
function getAvatarById(id) {
    return Avatar.findById(id).exec();
}
