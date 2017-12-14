import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import Config from '../config/config';
import User from '../user/user.model';
import * as AuthUtils from './auth.utils';
import * as UserRepository from '../user/user.repository';

const env = process.env.NODE_ENV || "development";
const config = Config[env];

export function verifyToken(req) {
    return new Promise((resolve, reject) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            try {
                const decoded = jwt.verify(token, config.token_secret);
                req.decoded = decoded;
                resolve(decoded);
            } catch (err) {
                reject({
                    success: false,
                    message: err.message,
                    error: err
                });
            }
        } else {
            reject({
                success: false,
                message: 'No token provided'
            });
        }
    });
}

export function protectRouteByUser(req) {
    return new Promise((resolve, reject) => {
        if (!req.decoded) {
            reject({
                sucess: false,
                message: 'Token has not yet been verified'
            });
        }
        if (req.decoded && req.decoded.sub === req.params.userid) {
            resolve(true);
        } else {
            reject({
                success: false,
                message: 'Not an authorized user for this route'
            });
        }
    });
}

export function adminRoute(req) {
    return new Promise((resolve, reject) => {
        if (!req.decoded) {
            reject({
                sucess: false,
                message: 'Token has not yet been verified'
            });
        }
        User.findById(req.decoded.sub).exec()
            .then(user => {
                if (user.isAdmin()) {
                    resolve(true);
                } else {
                    reject({
                        success: false,
                        message: 'Not an authorized user for this route'
                    });
                }
            })
            .catch(err => reject(err));
    });
}

export function loginUser(req) {
    return new Promise((resolve, reject) => {
        User.findOne({email: req.body.email}).exec()
            .then(user => {
                if (user && user.verifyPassword(req.body.password)) {
                    const token = AuthUtils.generateToken(user);
                    resolve({user, token});
                } else {
                    reject({message: 'invalid username or password'});
                }
            })
            .catch(err => reject(err));
        });
}

/* Not sure if this will promisified... */
export const redirectToSFDC = (req, res) => {
    const clientId = process.env.SFDC_CLIENT_ID;
    const callback = encodeURI('http://localhost:3000/auth/callback');

    const url = 'https://login.salesforce.com/services/oauth2/authorize?' +
                'response_type=code' +
                '&client_id=' + clientId +
                '&redirect_uri=' + callback;

    res.redirect(url);
}

/* Promisify later, if needed.  Will be using passport for this logic in the near future... */
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
