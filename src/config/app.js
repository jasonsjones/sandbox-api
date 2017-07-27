import express from 'express';
import bodyParser from 'body-parser';
import userRoute from '../user/user.routes';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

userRoute(app);

export default app;
