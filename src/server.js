
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API!'
    });
})
app.listen(3000, () => {
    console.log(`node server running on port 3000`);
})