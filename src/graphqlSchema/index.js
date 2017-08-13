import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
} from 'graphql';
import User from '../user/user.model';
import Avatar from '../avatar/avatar.model';

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
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
            resolve(parentValue, args) {
                return  User.findById(args.id).exec();
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return User.find({}).exec();
            }
        },
        avatars: {
            type: new GraphQLList(AvatarType),
            resolve() {
                return Avatar.find({}).exec();
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery
});
