import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const avatarSchema = new Schema({
    contentType: String,
    data: Buffer,
    fileSize: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    defaultImg: Boolean
});

const Avatar = mongoose.model('Avatar', avatarSchema);
export default Avatar;
