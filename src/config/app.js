import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import avatarRoute from '../avatar/avatar.routes';
import userRoute from '../user/user.routes';
import indexRoute from '../index/index.routes';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

avatarRoute(app);
userRoute(app);
indexRoute(app);

export default app;
