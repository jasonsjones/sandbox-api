import mongoose from 'mongoose';
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
    console.log('In the user pre-save hook....the this context is ');
    console.log(this);
    console.log('this is where we will hash the password if it changed');
    console.log('is password modified: ' + this.isModified('password'));
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
