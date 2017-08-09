import fs from 'fs';
import Avatar from './avatar.model';

export function getAvatars(req, res) {
    Avatar.find({}, '-data').exec()
        .then(avatars => {
            res.json({
                success: true,
                data: avatars
            });
        })
        .catch(err => {
            console.log(err);
        });
}

export function getAvatar(req, res) {
    if (req.params.id === 'default') {
        getDefaultAvatar();
    } else {
        getAvatarById();
    }

    function getDefaultAvatar() {
        Avatar.findOne({defaultImg: true}).exec()
            .then(sendImage)
            .catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    message: 'error sending avatar'
                });
            });
    }

    function getAvatarById() {
        Avatar.findById(req.params.id).exec()
            .then(sendImage)
            .catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    message: 'error sending avatar'
                });
            });
    }

    function sendImage(image) {
        res.contentType(image.contentType);
        res.write(image.data);
        res.end();
    }
}

export function uploadAvatar(req, res) {
    let avatar = new Avatar();
    avatar.fileName = req.file.originalname;
    avatar.contentType = req.file.mimetype;
    avatar.fileSize = req.file.size / 1000;
    avatar.defaultImg = false;
    avatar.data = fs.readFileSync(req.file.path);
    avatar.save()
        .then(img => {
            fs.unlinkSync(req.file.path);
            res.json({
                success: true,
                message: 'avatar uploaded and saved'
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

