'use strict';
const express = require('express');
const session = require('express-session');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const usersRouter = require('./routes/users-router');
const logger = require("../common-lib/logger");
const MongoSessionStore = require('connect-mongodb-session')(session);
const gameSocket = require('./socket/game');
const methodOverride = require('method-override');
const errorHandler = require('../common-lib/errorHandler');
const fs = require('fs');
const config = require("./config/db");
const spdy = require('spdy');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const options = {
    key: fs.readFileSync(__dirname + '/crt/server.key'),
    cert:  fs.readFileSync(__dirname + '/crt/server.crt')
};

let app = express();
let server = https.createServer(options, app);

const PORT = process.env.PORT;
let client = path.join(__dirname, '../client/dist/super-fire-bros/');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(methodOverride());
app.use(express.static(client));
app.use(passport.initialize({}));
app.use(errorHandler);

let app_session = session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false,
    store: new MongoSessionStore({
        uri: `mongodb://${process.env.DB_SERVER}/${process.env.DB}`,
        databaseName: process.env.DB,
        collection: 'sessions'
    })
});

gameSocket.init(server, app_session);
// session
app.use(app_session);

app.use('/users', usersRouter);
app.use(function (req, res, next) {
    logger.info("HTTP request", req.method, req.url, req.body);
});

server.listen(PORT, (err) => {
    if (err) {
        logger.error(err);
        return process.exit(1)
    } else {
        logger.info("HTTPS server on https://localhost:%s", PORT);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(client, "index.html"));
});

