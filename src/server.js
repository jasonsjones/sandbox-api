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

app.get('/api/users', (req, res) => {
    User.find({}).exec()
        .then(users => {
            res.json({staus: true, data: users});
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/api/user/:id', (req, res) => {
    User.findOne({_id: req.params.id}).exec()
        .then(user => {
            res.json({status: 'success', data: user});
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/api/users', (req, res) => {
    let newUser = new User(req.body);
    newUser.save()
        .then(user => {
            res.json({
                status: 'succuess', 
                message: 'new user saved', 
                data: user
            })
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/api/user/:userid/avatar', upload.single('avatar'), (req, res) => {
    let userPromise = User.findOne({_id: req.params.userid}).exec();

    let avatarPromise = userPromise.then(user => {
        let avatar = new Avatar();
        avatar.fileName = req.file.originalname;
        avatar.contentType = req.file.mimetype;
        avatar.defaultImg = false;
        avatar.data = fs.readFileSync(req.file.path);
        avatar.user = user._id;
        return avatar.save();
    });

    Promise.all([userPromise, avatarPromise]).then(values => {
        let [user, img] = values;
        fs.unlinkSync(req.file.path);
        user.avatar = img._id;
        user.avatarUrl = `http://localhost:3000/api/avatar/${img._id}`;
        return user.save();
    }).then(user => {
        res.json({message: 'avatar uploaded...', data: user});
    })
    .catch(err => {
        console.log(err);
    });
});

app.listen(3000, () => {
    console.log(`node server running on port 3000`);
    console.log('dirname: ' + __dirname);
});