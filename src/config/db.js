import fs from 'fs';
import mongoose from 'mongoose';
import User from '../user/user.model';
import Avatar from '../avatar/avatar.model';

export default (config) => {
    console.log('setting up mongodb...');
    mongoose.Promise = global.Promise;
    mongoose.connect(config.dbUrl, { useMongoClient: true });
    let db = mongoose.connection;

    db.once('open', function () {
        console.log(`Connected to mongo`);
        console.log('cleaning db...');
        db.dropDatabase();

        const arrow = new User({
            name: "Oliver Queen",
            email: "oliver@qc.com",
            password: "arrow"
        });

        arrow.save(function (err, user) {
            if (err) return console.log(err);
            console.log("default user saved...");
        });

        const defaultAvatar = new Avatar({
            contentType: "image/png",
            data: fs.readFileSync(__dirname+'/../../assets/default_avatar.png'),
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

    process.once('SIGUSR2', () => {
        db.close(() => {
            console.log('Mongoose default connection closed via nodemon restart');
            process.kill(process.pid, 'SIGUSR2');
        });
    });

    return db;
}
