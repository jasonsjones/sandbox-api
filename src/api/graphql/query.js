import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList,
} from 'graphql';

import UserType from './types/userType';
import * as userRepository from '../user/user.repository';
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
export default new GraphQLObjectType({
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
