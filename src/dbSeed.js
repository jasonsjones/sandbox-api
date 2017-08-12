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
                let users = [
                    {
                        name: "Oliver Queen",
                        email: "oliver@qc.com",
                        password: "arrow"
                    },
                    {
                        name: "John Diggle",
                        email: "dig@qc.com",
                        password: "spartan"
                    },
                    {
                        name: "Roy Harper",
                        email: "roy@qc.com",
                        password: "arsenal"
                    }
                ];
                return User.create(users);
            } else {
                dbConn.close();
                return;
            }
        })
        .then(() => {
            return Avatar.find({defaultImg: true}).exec()
        })
        .then(avatars => {
            if (avatars.length === 0) {
                const defaultAvatar = new Avatar({
                    contentType: "image/png",
                    fileSize: fs.statSync(__dirname + '/../assets/default_avatar.png').size / 1000,
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
