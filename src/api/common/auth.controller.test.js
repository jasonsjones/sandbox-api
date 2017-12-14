import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';
import jwt from 'jsonwebtoken';

import * as Controller from './auth.controller';

describe('Auth controller', () => {
    describe('verifyToken()', () => {
        it('returns a promise that resolves with the decoded token', () => {
            const expected = {
                sub: '59c44d83f2943200228467b1',
                email: 'oliver@qc.com',
                iat: '1234',
                exp: '56789'
            };
            const req = {
                query: {},
                body: {
                    token: 'thisisa.simulated.tokenvalue'
                },
                headers: {}
            };
            const jwtStub = sinon.stub(jwt, 'verify');
            jwtStub.returns(expected);

            const promise = Controller.verifyToken(req);
            expect(promise).to.be.a('Promise');

            return promise.then(response => {
                expect(req.decoded).to.exist;
                expect(response).to.be.an('object');
                expect(response).to.have.property('sub');
                expect(response).to.have.property('email');
                expect(response).to.have.property('iat');
                expect(response).to.have.property('exp');
                jwtStub.restore();
            })
        });

        it('rejects if no token is provided', () => {
            const req = {
                query: {},
                body: {},
                headers: {}
            };

            const promise = Controller.verifyToken(req);
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expectError(err);
                expect(err.success).to.be.false;
            });
        });

        it('rejects with an error if there is something wrong with the token', () => {
            const req = {
                query: {},
                body: {
                    token: 'thisisa.simulated.tokenvalue'
                },
                headers: {}
            };
            const jwtStub = sinon.stub(jwt, 'verify');
            jwtStub.throws({name: 'JsonWebTokenError', message: 'jwt malformed'});

            const promise = Controller.verifyToken(req);
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expectError(err);
                jwtStub.restore();
            });
        });
    });
});

const expectError = err => {
    expect(err).to.exist;
    expect(err).to.be.an('object');
    expect(err).to.have.property('success');
    expect(err).to.have.property('message');
    expect(err.success).to.be.false;
};
