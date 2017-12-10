import mongoose from 'mongoose';
import { expect } from 'chai';
import User from './user.model';
import * as middleware from './user.model.middleware';

mongoose.Promise = global.Promise;

describe('User model', () => {
    it('is invalid if name is empty', (done) => {
        let user = new User({
            /* no name */
            email: 'oliver@qc.com',
            password: 'arrow'
        });
        user.validate((err) => {
            expect(err.errors.name).to.exist;
            expect(err.name).to.equal('ValidationError');
            done()
        });
    });

    it('is invalid if email is empty', (done) => {
        let user = new User({
            name: 'Oliver Queen',
            /* no email */
            password: 'arrow'
        });
        user.validate((err) => {
            expect(err.errors.email).to.exist;
            expect(err.name).to.equal('ValidationError');
            done()
        });
    });

    it('is invalid if password is empty', (done) => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            /* no password */
        });
        user.validate((err) => {
            expect(err.errors.password).to.exist;
            expect(err.name).to.equal('ValidationError');
            done()
        });
    });

    it('isAdmin() is true if user has an admin role', () => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow',
            roles: ['admin', 'user']
        });
        expect(user.isAdmin()).to.be.true;
    });

    it('isAdmin() is false if user does not have an admin role', () => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow'
        });
        expect(user.isAdmin()).to.be.false;
    });

    it('verifies a correct password', (done) => {
        const ORIG_PWD = 'arrow';
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: ORIG_PWD,
            isModified: () => {
                return true;
            }
        });
        // need to bind the middleware function to the user to ensure the
        // proper 'this' context from within the function
        middleware.hashPassword.bind(user, (err, user) => {
            expect(user.verifyPassword(ORIG_PWD)).to.be.true;
            done();
        })();
    }).timeout(6000);

    it('does not verify an incorrect password', (done) => {
        const ORIG_PWD = 'arrow';
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: ORIG_PWD,
            isModified: () => {
                return true;
            }
        });
        // need to bind the middleware function to the user to ensure the
        // proper 'this' context from within the function
        middleware.hashPassword.bind(user, (err, user) => {
            expect(user.verifyPassword('wrongPassword')).to.be.false;
            done();
        })();
    }).timeout(6000);

    it('adds a valid role to a user', () => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow',
            roles: ['user']
        });
        user.addRole('admin');
        expect(user.roles).to.contain('user');
        expect(user.roles).to.contain('admin');
        expect(user.roles.length).to.equal(2);
    });

    it('does not add an invalid role to a user', () => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow',
            roles: ['user']
        });
        user.addRole('superhero');
        expect(user.roles).to.contain('user');
        expect(user.roles).to.not.contain('superhero');
        expect(user.roles.length).to.equal(1);
    });

    it('does not add an empty role to a user', () => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow',
            roles: ['user']
        });
        user.addRole('');
        expect(user.roles).to.contain('user');
        expect(user.roles.length).to.equal(1);
    });

    it('removes a valid role from a user', () => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow',
            roles: ['user', 'admin', 'dev']
        });
        expect(user.roles.length).to.equal(3);
        user.removeRole('admin');
        expect(user.roles.length).to.equal(2);
        expect(user.roles).to.not.contain('admin');
    });

    it('ignores removing an invalid role from a user', () => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow',
            roles: ['user', 'admin', 'dev']
        });
        expect(user.roles.length).to.equal(3);
        user.removeRole('invalidRole');
        expect(user.roles.length).to.equal(3);
    });

    it('ignores removing a valid role the user does not have', () => {
        let user = new User({
            name: 'Oliver Queen',
            email: 'oliver@qc.com',
            password: 'arrow',
            roles: ['user', 'dev']
        });
        expect(user.roles.length).to.equal(2);
        user.removeRole('admin');
        expect(user.roles.length).to.equal(2);
    });
});

