import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
} from 'graphql';

import User from '../api/user/user.model';
import Avatar from '../api/avatar/avatar.model';

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        roles: {type: new GraphQLList(GraphQLString)},
        avatar: {type: GraphQLString},
        avatarUrl: {type: GraphQLString}
    })
});

// Avatar Type
const AvatarType = new GraphQLObjectType({
    name: 'Avatar',
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
    fields: {
        user: {
            type: UserType,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (parentValue, args) =>  User.findById(args.id).exec()
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: () =>  User.find({}).exec()
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
