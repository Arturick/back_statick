require('dotenv').config()
const express = require('express');
const cors = require('cors');
const router = require('./router/router');
const errorMW = require('./midleware/error-midleware');

const PORT = process.env.PORT || 5000;
const app = express()
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use('/api', router);
app.use(errorMW);

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();