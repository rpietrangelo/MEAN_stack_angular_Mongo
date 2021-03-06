const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser')

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) {
        console.log('Could not connect to the database!');
    }
    else{
        console.log('Successfully connected to: ' + config.db +  '!')
    }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);

app.get('*', (req, res) => {
    res.sendFile(Path.join(__dirname + '/client/dist/index.html'));
});

//http://localhost:8080
app.listen(8080, () =>{
    console.log('Listening on Port 8080!');
});