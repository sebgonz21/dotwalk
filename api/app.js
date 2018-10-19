/**
 * Application
 */

const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const startup = require('../startup/startup.js');
const tableRoutes = require('./routes/tables.js');
const dataRoutes = require('./routes/data.js');
const interface = require('../UI.js');

/** MIDDLEWARE */
app.use(bodyParser.json());
/**LOGGING MIDDLEWARE */
app.use(morgan('dev'));

app.use(interface);

/** Start Schemas loader */
startup.start();


app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    
    next();
});





app.get('/api',(req,res)=>{
    res.send("API is working");
});

/** ROUTES */
app.use('/api/tables',tableRoutes);
app.use('/api/data',dataRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;

