import jwt from 'jsonwebtoken';
import Config from '../../config/config';
import User from '../user/user.model';

const env = process.env.NODE_ENV || "development";
const config = Config[env];

export function verifyToken(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.token_secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error with the token',
                    payload: null
                });
            }
            if (decoded) {
                req.decoded = decoded
                next();
            } else {
                res.status(401);
                res.json({
                    success: false,
                    message: 'invalid token provided',
                    payload: null
                });
            }
        });
    } else {
        res.status(401);
        res.json({
            success: false,
            message: 'No token provided',
            payload: null
        });
    }
}

export function protectRouteByUser(req, res, next) {
    if (req.decoded && req.decoded.sub === req.params.userid) {
        next();
    } else {
        res.status(401);
        res.json({
            success: false,
            message: 'Not an authorized user for this route',
            payload: null
        });
    }
}

export function adminRoute(req, res, next) {
    User.findById(req.decoded.sub).exec()
        .then(user => {
            if (user.isAdmin()) {
                next();
            } else {
                res.status(401);
                res.json({
                    success: false,
                    message: 'Not an authorized user for this route',
                    payload: null
                });
            }
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
}

export function loginUser(req, res) {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if (user && user.verifyPassword(req.body.password)) {
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
