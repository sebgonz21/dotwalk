const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/dotWalkUI/'));
app.use(express.static(__dirname + '/dotWalkUI/public'));

app.get('/favicon.ico',(req,res)=>{
    res.send('fav');
});



module.exports = app;