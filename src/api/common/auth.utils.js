import jwt from 'jsonwebtoken';

import Config from '../config/config';

const env = process.env.NODE_ENV || "development";
const config = Config[env];

export const generateToken = (user) => {
    const token = jwt.sign({
        sub: user._id,
        email: user.email
    }, config.token_secret, {expiresIn: '24hr'});

    return token;
}
