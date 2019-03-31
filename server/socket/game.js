const logger = require('../../common-lib/logger');
const io = require('socket.io')();

module.exports = {
    init: function (server, session) {
        io.attach(server);

        let players = {};
        let spectators = [];
        let coin = {
            x: 0,
            y: 0,
        };
        let winteam = [];
        let scores = {
            white: 0,
            yellow: 0
        };
        let connection = 0;
        let lastPlayerTeam = true;
        let bullets = [];
        let coins = new Map();

        function generateCoin() {
            coin.x = Math.floor(Math.random() * 500) + 50;
            coin.y = Math.floor(Math.random() * 400) + 50;
        }

        let nsp = io.of('/chat');
        nsp.on("connection", socket => {
            socket.on("message", message => {
                let msg = message.replace(/(\r\n|\n|\r)/g, " ");
                nsp.emit("message", {type: "new-message", text: msg});
            });
        });

        let spec = io.of('/spec');
        spec.on('connection', function (socket) {
            if (connection === 0) {
                scores.white = 0;
                scores.yellow = 0;
                coins.clear();
                players = {};
                socket.emit('coin', 6, { x:0, y:0});
                socket.emit('updateScore', scores);
            } else {
                Object.keys(coins).some(function (coin_key){
                    socket.emit('coin', coins[coin_key], coin_key);
                });
                socket.emit('updateScore', scores);
            }
            logger.info('new spectator connected: ', socket.id);
            spectators.push(socket.id);
            socket.emit('currentPlayers', players);

            socket.on('disconnect', function () {
                spectators = spectators.filter(function(spectator){
                    return spectator !== socket.id;
                })
            })

        });

        let game = io.of('/game');
        game.on('connection', function (socket) {
            logger.info('new player connected: ', socket.id);

            if (connection === 0) {
                scores.white = 0;
                scores.yellow = 0;
                coins.clear();
            }
            // new player joined
            connection++;
            players[socket.id] = {
                x: Math.floor(Math.random() * 500) + 50,
                y: Math.floor(Math.random() * 400) + 50,
                playerId: socket.id,
                team: (lastPlayerTeam) ? 'yellow' : 'white'
            };
            lastPlayerTeam = lastPlayerTeam !== true;
            socket.emit('currentPlayers', players);
            spectators.forEach(function (spec) {
                io.of('/spec').to(spec).emit('currentPlayers', players);
            });

            if (connection == 1) {
                for (let i = 1; i < 6; i++) {
                    generateCoin();
                    let coin_x = coin.x;
                    let coin_y = coin.y;
                    coins[i] = { x: coin_x, y: coin_y};
                    socket.emit('coin', coin, i);
                    spectators.forEach(function (spec) {
                        io.of('/spec').to(spec).emit('coin', coin, i);

                    });
                }
            } else {
                Object.keys(coins).some(function (coin_key){
                    socket.emit('coin', coins[coin_key], coin_key);
                });
            }

            socket.emit('updateScore', scores);
            socket.broadcast.emit('newPlayer', players[socket.id]);
            spectators.forEach(function (spec) {
                io.of('/spec').to(spec).emit('updateScore', scores);
            });
            socket.on('disconnect', function () {
                connection--;
                if (connection === 0) {
                    scores.white = 0;
                    scores.yellow = 0;
                    coins.clear();
                    let empty = {};
                    spectators.forEach(function (spec) {
                        io.of('/spec').to(spec).emit('currentPlayers', empty);
                        io.of('/spec').to(spec).emit('updateScore', scores);
                        io.of('/spec').to(spec).emit('coin', 6, { x:0, y:0});
                    })
                }
                logger.info('user disconnected: ', socket.id);
                delete players[socket.id];
                game.emit('disconnect', socket.id);

            });

            socket.on('move', function (movement) {
                players[socket.id].x = movement.x;
                players[socket.id].y = movement.y;
                socket.broadcast.emit('movement', players[socket.id]);
                spectators.forEach(function (spec) {
                    io.of('/spec').to(spec).emit('movement', players[socket.id]);
                });
            });

            socket.on('flip', function (flipX) {
                players[socket.id].flipX = flipX.angle;
                socket.broadcast.emit('flipX', players[socket.id]);
                spectators.forEach(function (spec) {
                    io.of('/spec').to(spec).emit('flipX', players[socket.id]);
                });
            });

            socket.on('collectCoin', function (i) {
                if (players[socket.id].team === 'yellow') {
                    scores.yellow += 5;
                } else {
                    scores.white += 5;
                }
                generateCoin();
                let coin_x = coin.x;
                let coin_y = coin.y;
                coins[i] = { x: coin_x, y: coin_y};
                game.emit('coin', coin, i);
                game.emit('updateScore', scores);
                spectators.forEach(function (spec) {
                    io.of('/spec').to(spec).emit('coin', coin, i);
                    io.of('/spec').to(spec).emit('updateScore', scores);
                });
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
                                game.emit('hitted', id);
                                spectators.forEach(function (spec) {
                                    io.of('/spec').to(spec).emit('hitted', id);
                                });
                                if (players[id].team === 'yellow') {
                                    scores.white += 10;
                                } else {
                                    scores.yellow += 10;
                                }
                                game.emit('updateScore', scores);
                                spectators.forEach(function (spec) {
                                    io.of('/spec').to(spec).emit('updateScore', scores);
                                });
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

            if (scores.yellow >= 2000 || scores.white >= 2000) {
                if (scores.yellow >= 2000) {
                    winteam[0] = 'yellow'
                } else {
                    winteam[0] = 'white'
                }
                game.emit('winTeam', winteam);
                spectators.forEach(function (spec) {
                    io.of('/spec').to(spec).emit('winTeam', winteam);
                });
                scores.yellow = 0;
                scores.white = 0;
                game.emit('updateScore', scores);
                spectators.forEach(function (spec) {
                    io.of('/spec').to(spec).emit('updateScore', scores);
                });
            }

            game.emit("renderBullets", bullets);
            spectators.forEach(function (spec) {
                io.of('/spec').to(spec).emit("renderBullets", bullets);
            });
        }, 16);
    }
};
