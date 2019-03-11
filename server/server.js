// import dependencies
'use strict';
const express = require('express');
const session = require('express-session');
const https = require('http');
const path = require('path');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const usersRouter = require('./routes/users-router');
const logger = require("../common-lib/logger");
const MongoSessionStore = require('connect-mongodb-session')(session);

let app = express();
let server = https.createServer(app);
let PORT = process.env.PORT;
let client = path.join(__dirname, '../client/dist/super-fire-bros/');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(express.static(client));

// Session
app.use(session({
    secret: 'CSCC09 TOPSECRET',
    resave: true,
    saveUninitialized: false,
    store: new MongoSessionStore({
        uri: `mongodb://${process.env.DB_SERVER}/${process.env.DB}`,
        databaseName: process.env.DB,
        collection: 'sessions'
    })
}));

app.use('/users', usersRouter);
app.use(function (req, res, next){
    logger.info("HTTP request", req.method, req.url, req.body);
});

server.listen(PORT, function (err) {
    if (err) console.log(err);
    else logger.info("HTTPS server on http://localhost:%s", PORT);
});

app.get('/', (req, res)=> {
    res.sendFile(path.join(client, "index.html"));
});

