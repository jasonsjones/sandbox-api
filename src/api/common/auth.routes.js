import * as authController from './auth.controller';

export default (app) => {

    app.get('/auth/sfdc', authController.redirectToSFDC);

    app.get('/auth/callback', authController.sfdcCallback);
}
