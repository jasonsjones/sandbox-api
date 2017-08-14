import mongoose from 'mongoose';
import { expect } from 'chai';
import User from './user.model';
import * as middleware from './user.model.middleware';

mongoose.Promise = global.Promise;

describe('User Model', function () {
    it('is invalid if name is empty', function (done) {
        let user = new User({
            /* no name */
            email: 'oliver@qc.com',
            password: 'arrow'
        });
        user.validate(function (err) {
            expect(err.errors.name).to.exist;
            expect(err.name).to.equal("ValidationError");
            done()
        });
    });

    it('is invalid if email is empty', function (done) {
        let user = new User({
            name: 'Oliver Queen',
            /* no email */
            password: 'arrow'
        });
        user.validate(function (err) {
            expect(err.errors.email).to.exist;
            expect(err.name).to.equal("ValidationError");
            done()
        });
    });

    it('is invalid if password is empty', function (done) {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            /* no password */
        });
        user.validate(function (err) {
            expect(err.errors.password).to.exist;
            expect(err.name).to.equal("ValidationError");
            done()
        });
    });

    it('hashes the password to save in db', function (done) {
        const ORIG_PWD = 'arrow';
        let user = {
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: ORIG_PWD,
            isModified: function () {
                return true;
            }
        };
        // need to bind the middleware function to the user to ensure the
        // proper 'this' context from within the function
        middleware.hashPassword.bind(user, function (err, user) {
            expect(user.password).to.not.equal(ORIG_PWD);
            expect(user.password.startsWith('$2a$')).to.be.true;
            done();
        })();
    });

    it('isAdmin() is true if user has an admin role', function () {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow',
            roles: ["admin", "user"]
        });
        expect(user.isAdmin()).to.be.true;
    });

    it('isAdmin() is false  if user does not have an  admin role', function () {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow'
        });
        expect(user.isAdmin()).to.be.false;
    });
});

