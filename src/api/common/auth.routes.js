import * as authController from './auth.controller';

export default (app) => {

    app.get('/auth/sfdc', authController.redirectToSFDC);

    app.get('/auth/callback', authController.sfdcCallback);

    app.get('/api/signout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    });

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
