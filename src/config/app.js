import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import graphqlHTTP from 'express-graphql';
import schema from '../graphql';
import avatarRoute from '../api/avatar/avatar.routes';
import userRoute from '../api/user/user.routes';
import indexRoute from '../api/index/index.routes';
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use('/graphql', graphqlHTTP({
    schema,
    pretty: true,
    graphiql: true
}));

avatarRoute(app);
userRoute(app);
indexRoute(app);

export default app;
