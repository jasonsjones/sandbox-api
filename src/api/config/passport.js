import User from '../user/user.model';
import LocalStrategy from './strategies/local';

export default (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });

    passport.use('local', LocalStrategy);
}
