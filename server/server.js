// import dependencies
const express = require('express');
const https = require('http');
const path = require('path');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const usersRouter = require('./routes/users-router');
const logger = require("../common-lib/logger");

let app = express();
let server = https.createServer(app);
let io = socketIO(server);
let PORT = process.env.PORT;
let client = path.join(__dirname, '../client/dist/super-fire-bros/');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(express.static(client));
app.use('/users', usersRouter);
app.use(function (req, res, next){
    logger.info("HTTP request", req.method, req.url, req.body);
});

// app.use('/users', userApi);

server.listen(PORT, function (err) {
    if (err) console.log(err);
    else logger.info("HTTPS server on http://localhost:%s", PORT);
});

app.get('/', (req, res)=> {
    res.sendFile(path.join(client, "index.html"));
});

