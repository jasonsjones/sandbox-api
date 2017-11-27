import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';

import User from './user.model';
import * as Repository from './user.repository';

const mockUsersWithAvatar = [
    {
        _id: "59c44d83f2943200228467b3",
        updatedAt: "2017-11-21T16:24:16.413Z",
        createdAt: "2017-09-21T23:38:43.338Z",
        name: "Roy Harper",
        email: "roy@qc.com",
        password: "$2a$12$DyizVZatjn.zMHeOhQI5nuIX64417O2zuRKXe/Ae0f06bLupmZ/d6",
        __v: 0,
        avatar: {
            _id: "5a145330e6d09600aff70ef9",
            updatedAt: "2017-11-21T16:24:16.403Z",
            createdAt: "2017-11-21T16:24:16.403Z",
            user: "59c44d83f2943200228467b3",
            fileSize: 138317,
            contentType: "image/png",
            defaultImg: false
        },
        avatarUrl: "http://localhost:3000/api/avatar/5a145330e6d09600aff70ef9",
        roles: [
            "user"
        ]
    },
    {
        _id: "59c44d83f2943200228467b1",
        updatedAt: "2017-09-21T23:38:45.575Z",
        createdAt: "2017-09-21T23:38:43.337Z",
        name: "Oliver Queen",
        email: "oliver@qc.com",
        password: "$2a$12$wwUJRxZdDzpZ5uK2u.7eNelWp6y4HT/WE/zzZ6e2L4VVvv/tJE2dK",
        __v: 0,
        avatar: {
            _id: "59c44d85f2943200228467b4",
            updatedAt: "2017-09-21T23:38:45.572Z",
            createdAt: "2017-09-21T23:38:45.572Z",
            contentType: "image/png",
            fileSize: 62079,
            user: "59c44d83f2943200228467b1",
            defaultImg: false
        },
        avatarUrl: "http://localhost:3000/api/avatar/59c44d85f2943200228467b4",
        roles: [
            "admin",
            "user"
        ]
    },
    {
        _id: "59c6c317f9760b01a35c63b1",
        updatedAt: "2017-11-16T17:56:35.118Z",
        createdAt: "2017-09-23T20:24:55.748Z",
        name: "Jason Jones",
        email: "jsjones96@gmail.com",
        password: "$2a$12$5GCSOcQgHZ1tJHaMiOvvXOcFCoOoZCmjkQfD9hd/vIrF/dm0zrXa2",
        __v: 0,
        avatar: null,
        avatarUrl: "http://localhost:3000/api/avatar/default",
        roles: [
            "user"
        ]
    }
];

const mockUsers = [
    {
        _id: "59c44d83f2943200228467b3",
        updatedAt: "2017-11-21T16:24:16.413Z",
        createdAt: "2017-09-21T23:38:43.338Z",
        name: "Roy Harper",
        email: "roy@qc.com",
        password: "$2a$12$DyizVZatjn.zMHeOhQI5nuIX64417O2zuRKXe/Ae0f06bLupmZ/d6",
        avatar:  "5a145330e6d09600aff70ef9",
        avatarUrl: "http://localhost:3000/api/avatar/5a145330e6d09600aff70ef9",
        roles: [
            "user"
        ]
    },
    {
        _id: "59c44d83f2943200228467b1",
        updatedAt: "2017-09-21T23:38:45.575Z",
        createdAt: "2017-09-21T23:38:43.337Z",
        name: "Oliver Queen",
        email: "oliver@qc.com",
        password: "$2a$12$wwUJRxZdDzpZ5uK2u.7eNelWp6y4HT/WE/zzZ6e2L4VVvv/tJE2dK",
        avatar: "59c44d85f2943200228467b4",
        avatarUrl: "http://localhost:3000/api/avatar/59c44d85f2943200228467b4",
        roles: [
            "admin",
            "user"
        ]
    },
    {
        _id: "59c6c317f9760b01a35c63b1",
        updatedAt: "2017-11-16T17:56:35.118Z",
        createdAt: "2017-09-23T20:24:55.748Z",
        name: "Jason Jones",
        email: "jsjones96@gmail.com",
        password: "$2a$12$5GCSOcQgHZ1tJHaMiOvvXOcFCoOoZCmjkQfD9hd/vIrF/dm0zrXa2",
        avatar: null,
        avatarUrl: "http://localhost:3000/api/avatar/default",
        roles: [
            "user"
        ]
    }
];

describe('User repository', function () {
    let UserMock;
    beforeEach(() => {
        UserMock = sinon.mock(User);
    });

    afterEach(() => {
        UserMock.restore();
    });

    describe('getUsers()', function () {
        it('resolves to an array of users', function () {
            UserMock.expects('find').withArgs({})
                .chain('exec')
                .resolves(mockUsers);

            const promise = Repository.getUsers();
            expect(promise).to.be.a('Promise');

            return promise.then(users => {
                expect(users).to.be.an('array');
                expect(users.length).to.equal(mockUsers.length);
                expect(users[0].avatar).to.be.a('String');
            });
        });

        it('resolves to an array of users with avatars populated', function () {
            UserMock.expects('find').withArgs({})
                .chain('populate').withArgs('avatar', '-data')
                .chain('exec')
                .resolves(mockUsersWithAvatar);

            const promise = Repository.getUsers({}, true);
            expect(promise).to.be.a('Promise');

            return promise.then(users => {
                expect(users).to.be.an('array');
                expect(users.length).to.equal(mockUsersWithAvatar.length);
                expect(users[0].avatar).to.be.an('Object');
            });
        });

        it('resolves to an array of QC users', function () {
            const qcRegex = new RegExp('@qc.com', 'i');
            UserMock.expects('find').withArgs({email: qcRegex})
                .chain('exec')
                .resolves([mockUsers[0], mockUsers[1]]);

            const promise = Repository.getUsers({email: qcRegex});
            expect(promise).to.be.a('Promise');

            return promise.then(users => {
                expect(users).to.be.an('array');
                expect(users.length).to.equal(2);
            });
        });

        it('rejects with an error if something went wrong', function () {
            UserMock.expects('find').withArgs({})
                .chain('exec')
                .rejects(new Error('Oops, something went wrong...'));

            const promise = Repository.getUsers();
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });
    });
});
