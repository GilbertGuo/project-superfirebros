import * as io from 'socket.io-client';
import {addOtherPlayers, addPlayer} from "./game";

//https://stackoverflow.com/questions/37764665/typescript-sleep/50797405
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function create() {
  this.bullets = [];
  // this.cameras.main.setBackgroundColor('#3f9cff');
  this.add.image(500,210,'background');

  let self = this;
  self.coin = {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined
  };
  this.socket = io();
  this.otherPlayers = this.physics.add.group();

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });
  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) otherPlayer.destroy();
    });
  });

  this.socket.on('flipX', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) otherPlayer.flipX = playerInfo.flipX;
    });
  });

  this.socket.on('movement', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    });
  });


  this.cursors = this.input.keyboard.createCursorKeys();

  this.whiteScoreText = this.add.text(16, 16, '', {fontSize: '32px', fill: '#FFFAFA'});
  this.yellowScoreText = this.add.text(300, 16, '', {fontSize: '32px', fill: '#FFFF00'});


  this.socket.on('updateScore', function (scores) {
    self.whiteScoreText.setText('White: ' + scores.white);
    self.yellowScoreText.setText('Yellow: ' + scores.yellow);
  });

  this.socket.on('coin', function (coin, key) {
    if (self.coin[key]) self.coin[key].destroy();
    self.coin[key] = self.physics.add.image(coin.x, coin.y, 'coin').setDisplaySize(30, 30);
    self.physics.add.overlap(self.bro, self.coin[key], function () {
      self.socket.emit('collectCoin', key);
    }, null, self);
  });

  this.socket.on('renderBullets', function (update_b) {
    // If there's not enough bullets on the client, create them
    for (let i = 0; i < update_b.length; i++) {
      if (!self.bullets[i]) {
        self.bullets[i] = self.physics.add.sprite(update_b[i].x, update_b[i].y, 'bullet').setDisplaySize(15, 15);
      } else {
        //Otherwise, just update it!
        self.bullets[i].x = update_b[i].x;
        self.bullets[i].y = update_b[i].y;
      }
    }
    // Otherwise if there's too many, delete the extra
    for (let i = update_b.length; i < self.bullets.length; i++) {
      self.bullets[i].destroy();
      self.bullets.splice(i, 1);
      i--;
    }
  });

  // Listen for any player hit events and make that player flash
  this.socket.on('hitted', function (id) {
    if (id == self.socket.id) {
      for (let i = 0; i < 5; i++) {
        self.bro.alpha = 0;
        (async () => {
          await delay(300);
          self.bro.alpha = 1
        })();
      }
    } else {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (id === otherPlayer.playerId) {
          for (let i = 0; i < 5; i++) {
            otherPlayer.alpha = 0;
            (async () => {
              await delay(300);
              otherPlayer.alpha = 1
            })();
          }
        }
      });

    }
  })
}
