import fs from 'fs';
import Config from './config/config';
import db from './config/db';
import User from './user/user.model';
import Avatar from './avatar/avatar.model';

const env = process.env.NODE_ENV || "development";
const config = Config[env];

let dbConn = db(config);
seedDatabase();

function seedDatabase() {
    User.find({}).exec()
        .then(users => {
            if (users.length === 0) {
                const arrow = new User({
                    name: "Oliver Queen",
                    email: "oliver@qc.com",
                    password: "arrow"
                });
                console.log("default user saved");
                return arrow.save()
            } else {
                dbConn.close();
                return;
            }
        })
        .then(user => {
            return Avatar.find({defaultImg: true}).exec()
        })
        .then(avatars => {
            if (avatars.length === 0) {
                const defaultAvatar = new Avatar({
                    contentType: "image/png",
                    data: fs.readFileSync(__dirname + '/../assets/default_avatar.png'),
                    defaultImg: true
                });
                console.log("default avatar saved");
                defaultAvatar.save()
                    .then(img => {
                        if (img) {
                            dbConn.close();
                        }
                    });
            }
        })
        .catch(err => {
            return console.log(err);
        })
}
