import express from 'express';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';

import avatarRoute from '../avatar/avatar.routes';
import userRoute from '../user/user.routes';
import indexRoute from '../index/index.routes';
import schema from '../graphqlSchema';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/graphql', graphqlHTTP({
    schema,
    pretty: true,
    graphiql: true
}));

avatarRoute(app);
userRoute(app);
indexRoute(app);

export default app;
