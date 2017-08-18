import User from '../user/user.model';

export function removeAvatarRefFromUser(avatar) {
    User.findById(avatar.user).exec()
        .then(user => {
            user.avatar = null;
            user.avatarUrl = 'http://localhost:3000/api/avatar/default';
            return user.save();
        })
        .catch(err => {
            console.log(err);
        });
}
