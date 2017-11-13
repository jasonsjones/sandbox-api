
import { expect } from 'chai';
import sinon from 'sinon';

import User from './user.model';
import * as Middleware from './user.model.middleware';

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
            Middleware.checkForErrors(error, user, (err) => {
                expect(err).to.exist;
                expect(err.message).to.equal(expectedErrorMsg);
                done();
            });
        });

        it('propagates any other errors', function (done) {
            const error = new Error('Something when wrong...');
            Middleware.checkForErrors(error, user, (err) => {
                expect(err).to.exist;
                expect(err).to.equal(error);
                done();
            });

        });
    });

    describe('hashPassword()', function () {
        it('hashes the password to save in db', function (done) {
            const ORIG_PWD = 'arrow';
            let user = new User({
                name: 'Oliver Queen',
                email: 'oliver@qc.com',
                password: ORIG_PWD,
            });
            // need to bind the middleware function to the user to ensure the
            // proper 'this' context from within the function
            Middleware.hashPassword.bind(user, function (err, hashedUser) {
                expect(hashedUser.password).to.not.equal(ORIG_PWD);
                expect(hashedUser.password.startsWith('$2a$')).to.be.true;
                done();
            })();
        });
    });

    describe('removeAvatarOnDelete()', function () {
        it('removes the users custom avatar when the user is deleted');
        it('rejects with an error if something goes wrong');
    });
});
