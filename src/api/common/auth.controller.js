import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import Config from '../config/config';
import User from '../user/user.model';
import utils from './auth.utils';
import * as UserRepository from '../user/user.repository';

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
                const token = utils.generateToken(user);
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

export const redirectToSFDC = (req, res) => {
    const clientId = process.env.SFDC_CLIENT_ID;
    const callback = encodeURI('http://localhost:3000/auth/callback');

    const url = 'https://login.salesforce.com/services/oauth2/authorize?' +
                'response_type=code' +
                '&client_id=' + clientId +
                '&redirect_uri=' + callback;

    res.redirect(url);
}

export const sfdcCallback = (req, res) => {
    let access_token;
    let clientId = process.env.SFDC_CLIENT_ID;
    let clientSecret = process.env.SFDC_CLIENT_SECRET;
    let callback = encodeURI('http://localhost:3000/auth/callback');
    let code = req.query.code;
    let bodyData = `grant_type=authorization_code&redirect_uri=${callback}&client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

    let sfdcUser = null;

    fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyData
    })
    .then(res => res.json())
    .then(json => {
        access_token = json.access_token;
        req.session.jwt = json.id_token;
        return fetch(json.id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
    })
    .then(res => res.json())
    .then(user => {
        sfdcUser = user;
        return UserRepository.lookupUserByEmail(user.email);
    })
    .then(localUser => {
        if (localUser) {
            req.session.user = localUser;
        } else {
            req.session.user = {
                id: sfdcUser.user_id,
                name: sfdcUser.display_name,
                email: sfdcUser.email,
                avatarUrl: sfdcUser.photos.picture
            }
        }
        res.redirect('/')
    })
    .catch(err => console.log(err));
}
