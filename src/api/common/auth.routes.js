import fetch from 'node-fetch';
import * as authController from './auth.controller';

export default (app) => {

    app.get('/auth/sfdc', authController.redirectToSFDC);

    app.get('/auth/callback', (req, res) => {
        let access_token;
        let clientId = process.env.SFDC_CLIENT_ID;
        let clientSecret = process.env.SFDC_CLIENT_SECRET;
        let callback = encodeURI('http://localhost:3000/auth/callback');
        let code = req.query.code;
        let bodyData = `grant_type=authorization_code&redirect_uri=${callback}&client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

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
            console.log(json);
            return fetch(json.id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        })
        .then(res => res.json())
        .then(user => {
            console.log(user);
            res.json({
                success: true,
                data: user
            });
        });
    });
};
