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
    white: 0,
    yellow: 0
};
let connection = 0;
let lastPlayerTeam = true;
let bullets = [];

function generateCoin() {
    coin.x = Math.floor(Math.random() * 500) + 50;
    coin.y = Math.floor(Math.random() * 400) + 50;
}

io.on('connection', function (socket) {
    logger.info('a user connected: ', socket.id);
    if(connection === 0) {
        scores.white = 0;
        scores.yellow = 0;
    }
    // new player joined
    connection++;
    players[socket.id] = {
        x: Math.floor(Math.random() * 500) + 50,
        y: Math.floor(Math.random() * 400) + 50,
        playerId: socket.id,
        team: (lastPlayerTeam) ? 'yellow' : 'white'
    };
    if (lastPlayerTeam === true) {
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
        connection--;
        logger.info('user disconnected: ', socket.id);
        delete players[socket.id];
        io.emit('disconnect', socket.id);
    });

    socket.on('move', function (movement) {
        players[socket.id].x = movement.x;
        players[socket.id].y = movement.y;
        socket.broadcast.emit('movement', players[socket.id]);
    });

    socket.on('flip', function (flipX) {
        players[socket.id].flipX = flipX.angle;
        socket.broadcast.emit('flipX', players[socket.id]);
    });

    socket.on('collectCoin', function (i) {
        if (players[socket.id].team === 'yellow') {
            scores.yellow += 5;
        } else {
            scores.white += 5;
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

setInterval(function () {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.x += bullet.speed_x;
        bullet.y += bullet.speed_y;

        for (let id in players) {
            if (players[bullet.owner_id] && players[id]) {
                if (bullet.owner_id !== id && players[bullet.owner_id].team !== players[id].team) {
                    // And your own bullet shouldn't kill you
                    let dx = players[id].x - bullet.x;
                    let dy = players[id].y - bullet.y;
                    if (Math.sqrt(dx * dx + dy * dy) < 25) {
                        bullet.x = -20;
                        bullet.y = -20;
                        io.emit('hitted', id);
                        if (players[id].team === 'yellow') {
                            scores.white += 1;
                        } else {
                            scores.yellow += 1;
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
}, 16);

// setInterval(ServerGameLoop, 16);

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

