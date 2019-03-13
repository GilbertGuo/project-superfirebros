// import dependencies
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

let app = express();
let server = https.createServer(app);
let PORT = process.env.PORT;
let client = path.join(__dirname, '../client/dist/super-fire-bros/');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(express.static(client));

//io
let io = require('socket.io').listen(server);
let players = {};
let coin = {
    x: 0,
    y: 0,
};
let scores = {
    blue: 0,
    red: 0
};
let lastPlayerTeam = true;
let bullets = [];

function generateCoin() {
    coin.x = Math.floor(Math.random() * 700) + 50;
    coin.y = Math.floor(Math.random() * 500) + 50;
}

io.on('connection', function (socket) {
    logger.info('a user connected: ', socket.id);
    // create a new player and add it to our players object
    players[socket.id] = {
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: (lastPlayerTeam) ? 'red' : 'blue'
    };
    if(lastPlayerTeam === true) {
        lastPlayerTeam = false;
    } else {
        lastPlayerTeam = true;
    }
    socket.emit('currentPlayers', players);
    for (let i = 1; i < 6; i++) {
        generateCoin();
        socket.emit('coin', coin, i);
    }
    socket.emit('updateScore', scores);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('disconnect', function () {
        logger.info('user disconnected: ', socket.id);
        delete players[socket.id];
        io.emit('disconnect', socket.id);
    });

    socket.on('move', function (movement) {
        players[socket.id].x = movement.x;
        players[socket.id].y = movement.y;
        socket.broadcast.emit('movement', players[socket.id]);
    });

    socket.on('collectCoin', function (i) {
        if (players[socket.id].team === 'red') {
            scores.red += 5;
        } else {
            scores.blue += 5;
        }
        generateCoin();
        io.emit('coin', coin, i);
        io.emit('updateScore', scores);
    });

    socket.on('fire', function (data) {
        if (players[socket.id] === undefined) return;
        let new_bullet = data;
        data.owner_id = socket.id; // Attach id of the player to the bullet
        bullets.push(new_bullet);
    });
});

function ServerGameLoop() {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.x += bullet.speed_x;
        bullet.y += bullet.speed_y;

        for (let id in players) {
            if(players[bullet.owner_id] && players[id]) {
                if (bullet.owner_id !== id && players[bullet.owner_id].team !== players[id].team) {
                    // And your own bullet shouldn't kill you
                    let dx = players[id].x - bullet.x;
                    let dy = players[id].y - bullet.y;
                    if (Math.sqrt(dx * dx + dy * dy) < 40) {
                        io.emit('hitted', id);
                        if (players[id].team === 'red') {
                            scores.blue += 1;
                        } else {
                            scores.red += 1;
                        }
                        io.emit('updateScore', scores);
                    }
                }
            }
        }
        // Remove if it goes too far off screen
        if (bullet.x < -10 || bullet.x > 1000 || bullet.y < -10 || bullet.y > 1000) {
            bullets.splice(i, 1);
            i--;
        }

    }
    io.emit("renderBullets", bullets);
}

setInterval(ServerGameLoop, 16);

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
app.use(function (req, res, next) {
    logger.info("HTTP request", req.method, req.url, req.body);
});

server.listen(PORT, function (err) {
    if (err) console.log(err);
    else logger.info("HTTPS server on http://localhost:%s", PORT);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(client, "index.html"));
});

