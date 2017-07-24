
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';

const app = express();
const Schema = mongoose.Schema;

const baseUrl = 'http://localhost:3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb://mongo/testdb');
let db = mongoose.connection;
db.once('open', function () {
    console.log(`Connected to mongo`);
    console.log('cleaning db...');
    db.dropDatabase();
    const arrow = new User({
        name: "Oliver Queen",
        email: "oliver@qc.com",
    });

    arrow.save(function (err, user) {
        if (err) return console.log(err);
        console.log("default user saved...");
        console.log(user);
    });

    const defaultAvatar = new Avatar({
        fileName: "default_avatar.png",
        contentType: "image/png",
        data: fs.readFileSync(__dirname+'/../assets/default_avatar.png'),
        defaultImg: true
    });

    defaultAvatar.save(function (err) {
        if (err) return console.log(err);
    });
});
db.on('error', console.error.bind(console, 'connection error'));
db.on('disconnected', () => {
    console.log(`Mongoose disconnected`);
});
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Mongoose default connection closed via app termination');
        process.exit(0);
    });
});

const avatarSchema = new Schema({
    fileName: String,
    contentType: String,
    data: Buffer,
    defaultImg: Boolean
});

const Avatar = mongoose.model('Avatar', avatarSchema);

const userSchema = new Schema({ 
    name: String,
    email: String,
    avatar: {type: Schema.Types.ObjectId, ref: 'Avatar'},
    avatarUrl: {type: String, default: `${baseUrl}/api/avatar/default`}
});

const User = mongoose.model('User', userSchema);

const upload = multer({dest: './uploads/'});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API!'
    });
});

app.get('/api/avatar', (req, res) => {
    Avatar.find({}, '-data', function (err, avatars) {
        if (err) {
            console.log(err);
            return;
        }
        res.json({
            status: true,
            data: avatars
        });
    });
});


app.post('/api/avatar', upload.single('avatar'), (req, res) => {
    let avatar = new Avatar();
    avatar.fileName = req.file.originalname;
    avatar.contentType = req.file.mimetype;
    avatar.defaultImg = false;
    avatar.data = fs.readFileSync(req.file.path);
    avatar.save(function (err, img) {
        if (err) {
            console.log(err);
            return;
        }
        fs.unlinkSync(req.file.path);
        res.json({message: 'avatar uploaded and saved...'});

    });
});

app.get('/api/avatar/:id', (req, res) => {
    if (req.params.id === 'default') {
        Avatar.findOne({defaultImg: true}, function (err, image) {
            if (err) {
                console.log(err);
                return;
            }
            res.contentType(image.contentType);
            res.write(image.data);
            res.end();
        });
    } else {
        Avatar.findById(req.params.id, function (err, avatar) {
            if (err) {
                console.log(err);
                return;
            }
            res.contentType(avatar.contentType);
            res.write(avatar.data);
            res.end();
        });
    }
});

app.get('/api/users', (req, res) => {
    User.find({}, function (err, users) {
        if (err) {
            console.log(err);
            return;
        }
        res.json({staus: true, data: users});
    });
});

app.get('/api/user/:id', (req, res) => {
    User.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            console.log(err);
            return;
        }
        res.json({status: true, data: user});
    });
});

app.post('/api/users', (req, res) => {
    let newUser = new User(req.body);
    newUser.save(function (err, user) {
        if (err) {
            console.log(err);
            return;
        }
        res.json({message: 'new user saved', data: user});
    });
});

app.post('/api/user/:userid/avatar', upload.single('avatar'), (req, res) => {
    User.findOne({_id: req.params.userid}, function (err, user) {
        if (err) {
            console.log(err);
            return;
        }
        let avatar = new Avatar();
        avatar.fileName = req.file.originalname;
        avatar.contentType = req.file.mimetype;
        avatar.defaultImg = false;
        avatar.data = fs.readFileSync(req.file.path);
        avatar.save(function (err, img) {
            if (err) {
                console.log(err);
                return;
            }
            fs.unlinkSync(req.file.path);
            user.avatar = img._id;
            user.avatarUrl = `http://localhost:3000/api/avatar/${img._id}`;
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.json({message: 'avatar uploaded...', data: user});
            });
        });
    });
});

app.listen(3000, () => {
    console.log(`node server running on port 3000`);
    console.log('dirname: ' + __dirname);
});