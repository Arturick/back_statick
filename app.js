require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cron = require("node-cron");
const cookieParser = require('cookie-parser');
const router = require('./router/router');
const errorMW = require('./midleware/error-midleware');
const product = require('./modules/product');

const PORT = process.env.PORT || 5000;
const app = express()
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);
app.use(errorMW);

const start = async () => {
    try {

        let task = cron.schedule('*/55  * * * *', async () => {
            await product.refreshDB();
            console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
        }, {
            scheduled: true,
            timezone: "Europe/Moscow"
        });
        task.start();
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();