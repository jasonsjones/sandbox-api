import app from './config/app';
import config from './config/config';
import db from './config/db';

const env = process.env.NODE_ENV || "development";

db(config[env]);

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the sandbox API!',
        version: '1.0'
    });
})

app.get('/', (req, res) => {
    res.redirect('/api');
});

app.listen(3000, () => {
    console.log(`node server running on port 3000`);
});
