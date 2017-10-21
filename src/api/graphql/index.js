import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
} from 'graphql';

import UserType from './types/userType';

import * as userRepository from '../user/user.repository';
import User from '../user/user.model';
import Avatar from '../avatar/avatar.model';

// Avatar Type
const AvatarType = new GraphQLObjectType({
    name: 'Avatar',
    description: 'Simple avatar type to represent a user avatar',
    fields: () => ({
        id: {type: GraphQLString},
        contentType: {type: GraphQLString},
        fileSize: {type: GraphQLFloat},
        defaultImg: {type: GraphQLBoolean},
        user: {type: GraphQLString},
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'The root query type',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (parentValue, args) => userRepository.getUser(args.id)
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: () => userRepository.getUsers()
        },
        avatars: {
            type: new GraphQLList(AvatarType),
            resolve: () => Avatar.find({}).exec()
        }
    }
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        signup: {
            type: UserType,
            args: {
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            resolve: (parentValue, args) => {
                let newUser = new User({
                    name: args.name,
                    email: args.email,
                    password: args.password
                });
                return newUser.save()
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (parent, args) => User.findByIdAndRemove(args.id).exec()
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});