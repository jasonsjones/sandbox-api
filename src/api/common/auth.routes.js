import * as AuthController from './auth.controller';
import utils from './auth.utils';

export default (app, passport) => {

    app.get('/auth/sfdc', AuthController.redirectToSFDC);

    app.get('/auth/callback', AuthController.sfdcCallback);

    app.get('/api/signout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    });

    app.post('/api/login', AuthController.loginUser);

    app.post('/api/passportlogin',
        passport.authenticate('local'),
        (req, res) => {
            res.json({
                success: true,
                message: 'authenticated via passport',
                payload: {
                    user: req.user,
                    token: utils.generateToken(req.user)
                }});
        }
    );

    app.get('/api/sessionUser', (req, res) => {
        if (req.session.user && req.session.jwt) {
            res.json({
                success: true,
                payload: {
                    user: req.session.user,
                    token: req.session.jwt
                }
            });
        } else {
            res.json({
                success: false
            });
        }
    });
}
