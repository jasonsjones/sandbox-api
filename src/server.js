import multer from 'multer';
import fs from 'fs';
import app from './config/app';
import config from './config/config';
import db from './config/db';
import User from './user/user.model';
import Avatar from './avatar/avatar.model';

const env = process.env.NODE_ENV || "development";
const baseUrl = 'http://localhost:3000';

db(config[env]);

const upload = multer({dest: './uploads/'});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API!'
    });
});

app.get('/api/avatar', (req, res) => {
    Avatar.find({}, '-data').exec()
        .then(avatars => {
            res.json({
                status: true,
                data: avatars
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/api/avatar', upload.single('avatar'), (req, res) => {
    let avatar = new Avatar();
    avatar.fileName = req.file.originalname;
    avatar.contentType = req.file.mimetype;
    avatar.defaultImg = false;
    avatar.data = fs.readFileSync(req.file.path);
    avatar.save()
        .then(img => {
            fs.unlinkSync(req.file.path);
            res.json({message: 'avatar uploaded and saved...'});
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/api/avatar/:id', (req, res) => {
    if (req.params.id === 'default') {
        Avatar.findOne({defaultImg: true}).exec()
            .then(sendImage)
            .catch(err => {
                console.log(err);
            });
    } else {
        Avatar.findById(req.params.id).exec()
            .then(sendImage)
            .catch(err => {
                console.log(err);
            });
    }

    function sendImage(image) {
        res.contentType(image.contentType);
        res.write(image.data);
        res.end();
    }
});

app.listen(3000, () => {
    console.log(`node server running on port 3000`);
    console.log('dirname: ' + __dirname);
});