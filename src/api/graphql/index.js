import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema
} from 'graphql';

import RootQuery from './query';
import UserType from './types/userType';

import User from '../user/user.model';

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
