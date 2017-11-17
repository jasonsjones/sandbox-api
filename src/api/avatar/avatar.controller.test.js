import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';

import * as AvatarRepository from './avatar.repository';
import * as Controller from './avatar.controller';

const mockAvatars = [
    {
      "_id": "59c44d83f2943200228467b0",
      "defaultImg": true,
      "fileSize": 5012,
      "contentType": "image/png",
      "user": null
    },
    {
      "_id": "59c44d85f2943200228467b4",
      "defaultImg": false,
      "fileSize": 62079,
      "contentType": "image/png",
      "user": "59c44d83f2943200228467b1",
    },
    {
      "_id": "59c44d9d0e584d00425c1722",
      "defaultImg": false,
      "fileSize": 71955,
      "contentType": "image/png",
      "user": "59c44d83f2943200228467b2",
    },
    {
      "_id": "59e4062a4c3bc800574e895f",
      "defaultImg": false,
      "fileSize": 117632,
      "contentType": "image/png",
      "user": "59c6c317f9760b01a35c63b1",
    }
];

describe('Avatar controller', function () {
    describe('getAvatars()', function () {
        let req, res, stub;
        beforeEach(() => {
            stub = sinon.stub(AvatarRepository, 'getAvatars');
            req = sinon.spy();
            res = {
                status: sinon.spy(),
                json: sinon.spy()
            }
        });

        afterEach(() => {
            stub.restore();
            req.reset();
            res.status.reset();
            res.json.reset();
        });

        it('sends a payload with an array of all avatars', function (done) {
            stub.resolves(mockAvatars);

            Controller.getAvatars(req, res, (err) => {
                const args = res.json.args[0][0];
                expect(err).not.to.exist;
                expect(res.json.calledOnce).to.be.true;
                expect(args).to.have.property('success');
                expect(args).to.have.property('data');
                expect(args.success).to.be.true;
                expect(args.data).to.be.an('Array');
                done();
            });
        });

        it('sends a status 500 if error occurs', function (done) {
            stub.rejects(new Error('Oops, something went wrong...'));

            Controller.getAvatars(req, res, (err) => {
                expect(err).to.exist;
                expect(res.json.calledOnce).to.be.true;
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                done();
            });
        });

        it('sends a success false and message when error occurs', function (done) {
            stub.rejects(new Error('Oops, something went wrong...'));

            Controller.getAvatars(req, res, (err) => {
                const args = res.json.args[0][0];
                expect(err).to.exist;
                expect(res.json.calledOnce).to.be.true;
                expect(args).to.have.property('success');
                expect(args).to.have.property('message');
                expect(args.success).to.be.false;
                done();
            });
        });
    });
});
