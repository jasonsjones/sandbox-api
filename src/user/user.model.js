import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import * as middleware from './user.model.middleware';
const Schema = mongoose.Schema;

const baseUrl = 'http://localhost:3000';

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: Schema.Types.ObjectId, ref: 'Avatar'},
    avatarUrl: {type: String, default: `${baseUrl}/api/avatar/default`}
}, {timestamps: true});

userSchema.pre('save', middleware.hashPassword);
userSchema.post('save', middleware.checkForErrors);
userSchema.post('remove', middleware.removeAvatarOnDelete);

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;
