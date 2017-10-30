import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';

import Avatar from './avatar.model';
import * as AvatarRepository from './avatar.repository';

const mockAvatars = [
    {
      "id": "59c44d83f2943200228467b0",
      "contentType": "image/png",
      "fileSize": 5012,
      "defaultImg": true,
      "user": null
    },
    {
      "id": "59c44d85f2943200228467b4",
      "contentType": "image/png",
      "fileSize": 62079,
      "defaultImg": false,
      "user": "59c44d83f2943200228467b1"
    },
    {
      "id": "59c44d9d0e584d00425c1722",
      "contentType": "image/png",
      "fileSize": 71955,
      "defaultImg": false,
      "user": "59c44d83f2943200228467b2"
    },
    {
      "id": "59c44dc50e584d00425c1723",
      "contentType": "image/png",
      "fileSize": 138317,
      "defaultImg": false,
      "user": "59c44d83f2943200228467b3"
    },
    {
      "id": "59e4062a4c3bc800574e895f",
      "contentType": "image/png",
      "fileSize": 117632,
      "defaultImg": false,
      "user": "59c6c317f9760b01a35c63b1"
    }
];

describe('Avatar Repository', function () {

    it('getAvatars() resolves to an array of avatars', function () {
        const AvatarMock = sinon.mock(Avatar);
        AvatarMock.expects('find').withArgs({})
            .chain('exec')
            .resolves(mockAvatars);

        const promise = AvatarRepository.getAvatars();
        expect(promise).to.be.a('Promise');

        return promise.then(avatars => {
            expect(avatars).to.be.an('array');
            expect(avatars.length).to.equal(5);
            AvatarMock.restore();
        });
    });

    it('getAvatars() rejects with an error if something went wrong', function () {
        const AvatarMock = sinon.mock(Avatar);
        AvatarMock.expects('find').withArgs({})
            .chain('exec')
            .rejects(new Error('Oops, something went wrong...'));

        const promise = AvatarRepository.getAvatars();
        expect(promise).to.be.a('Promise');

        return promise.catch(err => {
            expect(err).to.exist;
            expect(err).to.be.an('Error');
            AvatarMock.restore();
        });
    });
});
