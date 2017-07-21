
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';

const app = express();
const Schema = mongoose.Schema;

mongoose.connect('mongodb://mongo/testdb');
let db = mongoose.connection;
db.once('open', function () {
    console.log(`Connected to mongo`);
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
    console.log(req.file);
    let avatar = new Avatar();
    avatar.fileName = req.file.originalname;
    avatar.contentType = req.file.mimetype;
    avatar.defaultImg = true;
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
    Avatar.findById(req.params.id, function (err, avatar) {
        if (err) {
            console.log(err);
            return;
        }
        res.contentType(avatar.contentType);
        res.write(avatar.data);
        res.end();
    });
});

app.listen(3000, () => {
    console.log(`node server running on port 3000`);
});