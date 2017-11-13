
import { expect } from 'chai';

import User from './user.model';
import * as UserMiddleware from './user.model.middleware';

describe("User middleware", function () {
    describe('checkForErrors()', function () {
        let user;
        beforeEach(() => {
            user = new User({
                name: 'Oliver Queen',
                email: 'oliver@qc.com',
                password: 'arrow',
                roles: ['user']
            });
        });

        it('throws error if there are duplicate keys', function (done) {
            const expectedErrorMsg = 'There was a duplicate key error';
            const error = {
                name: 'MongoError',
                code: 11000
            };
            UserMiddleware.checkForErrors(error, user, (err) => {
                expect(err).to.exist;
                expect(err.message).to.equal(expectedErrorMsg);
                done();
            });
        });

        it('propagates any other errors', function (done) {
            const error = new Error('Something when wrong...');
            UserMiddleware.checkForErrors(error, user, (err) => {
                expect(err).to.exist;
                expect(err).to.equal(error);
                done();
            });

        });
    });
});
