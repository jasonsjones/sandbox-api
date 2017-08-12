import jwt from 'jsonwebtoken';
import Config from '../config/config';
import User from '../user/user.model';

const env = process.env.NODE_ENV || "development";
const config = Config[env];

export function protectRoute(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.token_secret, (err, decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error with the token',
                    payload: null
                });
            }
            if (decoded && decoded.sub === req.params.userid) {
                req.userId = decoded.sub;
                next();
            } else {
                res.json({
                    success: false,
                    message: 'invalid token provided',
                    payload: null
                });
            }
        });
    } else {
        res.json({
            success: false,
            message: 'No token provided',
            payload: null
        });
    }
}

export function loginUser(req, res) {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if (user.verifyPassword(req.body.password)) {
                let token = jwt.sign({
                    sub: user._id,
                    name: user.name
                },
                config.token_secret,
                {
                    expiresIn: '24hr'
                });
                res.json({
                    success: true,
                    message: 'user authenticated',
                    payload: {
                        user,
                        token
                    }
                });
            } else {
                res.json({
                    success: false,
                    message: 'invalid username or password',
                    payload: null
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'user not found',
                payload: null
            });
        });
}
