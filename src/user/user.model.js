import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import Avatar from '../avatar/avatar.model';
const Schema = mongoose.Schema;

const baseUrl = 'http://localhost:3000';

const userSchema = new Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    password: String,
    avatar: {type: Schema.Types.ObjectId, ref: 'Avatar'},
    avatarUrl: {type: String, default: `${baseUrl}/api/avatar/default`}
}, {timestamps: true});

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.post('save', function (error, user, next) {
    if (error.name === 'MongoError' && error.code == 11000) {
        next(new Error('There was a duplicate key error'))
    } else {
        next(err);
    }
});

userSchema.post('remove', function (user) {
    Avatar.findOne(user.avatar).exec()
        .then(avatar => {
            if (avatar && avatar.user.equals(user._id)) {
                return avatar.remove();
            }
        })
        .catch(err => {
            console.log(err);
        });
});

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;
