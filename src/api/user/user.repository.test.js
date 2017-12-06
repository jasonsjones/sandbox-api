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

    describe('getUser()', function () {
        it('resolves to a user with the given id', function () {
            const userId = mockUsers[0]._id;
            UserMock.expects('findById').withArgs(userId)
                .chain('exec')
                .resolves(mockUsers[0]);

            const promise = Repository.getUser(userId);
            expect(promise).to.be.a('Promise');

            return promise.then(user => {
                expectUserProperties(user);
            });
        });

        it('resolves to a user with the avatar model included', function () {
            const userId = mockUsersWithAvatar[0]._id;
            UserMock.expects('findById').withArgs(userId)
                .chain('exec')
                .resolves(mockUsersWithAvatar[0]);

            const promise = Repository.getUser(userId, true);
            expect(promise).to.be.a('Promise');

            return promise.then(user => {
                expectUserToHaveAvatar(user);
            });
        });

        it('rejects with an error if something went wrong', function () {
            const userId = mockUsers[0]._id;
            UserMock.expects('findById').withArgs(userId)
                .chain('exec')
                .rejects(new Error('Oops, something went wrong...'));

            const promise = Repository.getUser(userId);
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });
    });

    describe('lookupUserByEmail()', function () {
        it('resolves to a user with the given email', function () {
            const email = mockUsers[0].email;
            UserMock.expects('findOne').withArgs({email: email})
                .chain('exec')
                .resolves(mockUsers[0]);

            const promise = Repository.lookupUserByEmail(email);
            expect(promise).to.be.a('Promise');

            return promise.then(user => {
                expectUserProperties(user);
            });
        });

        it('resolves to a user with the avatar model included', function () {
            const email = mockUsersWithAvatar[0].email;
            UserMock.expects('findOne').withArgs({email: email})
                .chain('exec')
                .resolves(mockUsersWithAvatar[0]);

            const promise = Repository.lookupUserByEmail(email, true);
            expect(promise).to.be.a('Promise');

            return promise.then(user => {
                expectUserToHaveAvatar(user);
            });
        });

        it('rejects with an error if something went wrong', function () {
            const email = mockUsers[0].email;
            UserMock.expects('findOne').withArgs({email: email})
                .chain('exec')
                .rejects(new Error('Oops, something went wrong...'));

            const promise = Repository.lookupUserByEmail(email);
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });
    });

    describe('deleteUser()', function () {
        it('resovles to the deleted user when successful', function () {
            UserMock.expects('findByIdAndRemove').withArgs(mockUsers[1]._id)
                .chain('exec')
                .resolves(mockUsers[1]);

            const promise = Repository.deleteUser(mockUsers[1]._id);
            expect(promise).to.be.a('Promise');
            return promise.then(user => {
                expectUserProperties(user);
            });
        });

        it('rejects with error if something goes wrong', function () {
            UserMock.expects('findByIdAndRemove').withArgs(mockUsers[1]._id)
                .chain('exec')
                .rejects(new Error('Oops, something went wrong deleting the user'));

            const promise = Repository.deleteUser(mockUsers[1]._id);
            expect(promise).to.be.a('Promise');
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });
    });

    describe('signUpUser()', function () {
        let newUser;
        beforeEach(() => {
            newUser = {
                name: "Roy Harper",
                email: "roy@qc.com",
                password: 'arsenal',
                roles: [
                    "user"
                ]
            };
        });

        afterEach(() => {
            newUser = null;
        });

        it('resolves with user.save()', function () {
            const stub = sinon.stub(User.prototype, 'save');
            stub.resolves(mockUsers[0]);

            const promise = Repository.signUpUser(newUser);
            expect(promise).to.be.an('Promise');

            promise.then(user => {
                expectUserProperties(user);
                stub.restore();
            });
        });

        it('rejects with error if something goes wrong', function () {
            const stub = sinon.stub(User.prototype, 'save');
            stub.rejects(new Error('Ooops, something went wrong when saving the user'));

            const promise = Repository.signUpUser(newUser);
            expect(promise).to.be.an('Promise');

            promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
                stub.restore();
            });
        });
    });

    describe('updateUser()', function () {
        it('resolves with user.save()');
        it('rejects with error if something goes wrong');
    });

    describe('uploadUserAvatar()', function () {
        it('resolves with user.save()');
        it('rejects with error if something goes wrong');
    });

});

const expectUserToHaveAvatar = user => {
    expect(user).to.be.an('Object');
    expect(user).to.have.property('name');
    expect(user).to.have.property('email');
    expect(user).to.have.property('avatarUrl');
    expect(user).to.have.property('roles');
    expect(user).to.have.property('avatar');
    expect(user.avatar).to.be.an('Object');
    expect(user.avatar).to.have.property('user');
    expect(user.avatar).to.have.property('fileSize');
    expect(user.avatar).to.have.property('contentType');
};

const expectUserProperties = user => {
    expect(user).to.be.an('Object');
    expect(user).to.have.property('name');
    expect(user).to.have.property('email');
    expect(user).to.have.property('avatarUrl');
    expect(user).to.have.property('roles');
    expect(user).to.have.property('avatar');
};
