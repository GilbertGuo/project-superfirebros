'use strict';
const express = require('express');
const session = require('express-session');
const https = require('http');
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
const passport = require('passport');
const helmet = require('helmet');
const dbConfig = require('./config/db');

const PORT = process.env.PORT || 9000;

const options = {
    key: fs.readFileSync(__dirname + '/crt/server.key'),
    cert:  fs.readFileSync(__dirname + '/crt/server.crt')
};

let app = express();
let server = https.createServer(options, app);
let client = path.join(__dirname, '../client/dist/super-fire-bros/');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(methodOverride());
app.use(express.static(client));
app.use(passport.initialize({}));
app.use(passport.session({}));
app.use(errorHandler);

// WHAT IS HELMET DOING:
// csp sets the Content-Security-Policy header to help prevent cross-site scripting attacks and other cross-site injections.
// removes the X-Powered-By header.
// hpkp Adds Public Key Pinning headers to prevent man-in-the-middle attacks with forged certificates.
// hsts sets Strict-Transport-Security header that enforces secure (HTTP over SSL/TLS) connections to the server.
// ieNoOpen sets X-Download-Options for IE8+.
// noCache sets Cache-Control and Pragma headers to disable client-side caching.
// noSniff sets X-Content-Type-Options to prevent browsers from MIME-sniffing a response away from the declared content-type.
// frameguard sets the X-Frame-Options header to provide clickjacking protection.
// xssFilter sets X-XSS-Protection to enable the Cross-site scripting (XSS) filter in most recent web browsers.
app.use(helmet());

let app_session = session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false,
    store: new MongoSessionStore({
        uri: dbConfig.uri,
        collection: 'sessions'
    })
});

gameSocket.init(server, app_session);

// session
app.use(app_session);

app.use('/users', usersRouter);
app.get('*', (req, res) => {
    res.sendFile(path.join(client, "index.html"));
});

app.use(function (req, res, next) {
    logger.info("HTTP request", req.method, req.url, req.body);
    next();
});

server.listen(PORT, (err) => {
    if (err) {
        logger.error(err);
        return process.exit(1)
    } else {
        logger.info("HTTPS server on https://localhost:%s", PORT);
    }
});
