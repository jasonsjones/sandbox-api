import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';

import * as Repository from './avatar.repository';
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
        let stub;
        beforeEach(() => {
            stub = sinon.stub(Repository, 'getAvatars');
        });

        afterEach(() => {
            stub.restore();
        });

        it('sends a payload with an array of all avatars', function () {
            stub.resolves(mockAvatars);

            return Controller.getAvatars().then(response => {
                expect(response).to.have.property('success');
                expect(response).to.have.property('data');
                expect(response.success).to.be.true
                expect(response.data).to.be.an('Array');
            });
        });

        it('sends a success false and message when error occurs', function () {
            stub.rejects(new Error('Oops, something went wrong...'));

            return Controller.getAvatars().then(response => {
                expect(response).to.have.property('success');
                expect(response).to.have.property('message');
                expect(response).to.have.property('error');
                expect(response.success).to.be.false
                expect(response.error instanceof Error).to.be.true
            });
        });
    });

    describe('getAvatar()', function () {
        let req, stub;
        beforeEach(() => {
            stub = sinon.stub(Repository, 'getAvatar');
            req = {};
        });

        afterEach(() => {
            stub.restore();
            req = {};
        });

        it('sends the avatar data in the response');

        it('sends a success false and message when error occurs', function () {
            stub.withArgs(mockAvatars[1]._id)
                .rejects(new Error('Oops, something went wrong...'));

            req.params = {
               id : mockAvatars[1]._id
            };

            return Controller.getAvatar(req).then(response => {
                expect(response).to.have.property('success');
                expect(response).to.have.property('message');
                expect(response).to.have.property('error');
                expect(response.success).to.be.false
                expect(response.error instanceof Error).to.be.true
            });
        });
    });
});
