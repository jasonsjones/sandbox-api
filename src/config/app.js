import express from 'express';
import bodyParser from 'body-parser';
import avatarRoute from '../avatar/avatar.routes';
import userRoute from '../user/user.routes';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

avatarRoute(app);
userRoute(app);

export default app;
