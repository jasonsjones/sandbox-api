import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;

const baseUrl = 'http://localhost:3000';

const userSchema = new Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    password: String,
    avatar: {type: Schema.Types.ObjectId, ref: 'Avatar'},
    avatarUrl: {type: String, default: `${baseUrl}/api/avatar/default`}
});

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

userSchema.methods.confirmPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;
