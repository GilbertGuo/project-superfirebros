import * as io from 'socket.io-client';


//https://stackoverflow.com/questions/37764665/typescript-sleep/50797405
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class SpectateScene extends Phaser.Scene {
  private bullets: any[];
  socket: any;
  otherPlayers: any;
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private whiteScoreText: Phaser.GameObjects.Text;
  private yellowScoreText: Phaser.GameObjects.Text;
  private FinalWinTeam: Phaser.GameObjects.Text;
  coin: any;
  bro: any;
  private otherPlayer: any;

  constructor() {
    super({
      key: 'Scene',
    });
  }


  public preload() {

    this.load.image('bro', 'assets/mario.png');
    this.load.image('otherPlayer', 'assets/ghost.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('bullet', "assets/fire.png");
    this.load.image('background', "assets/newbg.png");
  }

  public create() {
    this.bullets = [];
    this.add.image(500, 210, 'background');

    let self = this;
    self.coin = {
      1: undefined,
      2: undefined,
      3: undefined,
      4: undefined,
      5: undefined
    };

    if (!this.socket) {
      this.socket = io('/spec');
    }
    this.otherPlayers = this.physics.add.group();

    this.socket.on('currentPlayers', function (players) {
      if (Object.keys(players).length != 0){
        Object.keys(players).forEach(function (id) {
          self.addOtherPlayers(players[id]);
        });
      } else {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
          otherPlayer.destroy();
        });
      }
    });

    this.socket.on('newPlayer', function (playerInfo) {
      self.addOtherPlayers(playerInfo);
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

    this.whiteScoreText = this.add.text(16, 16, '', {fontsize: '30px', fontFamily: 'game_font', fill: '#FFFAFA'});
    this.yellowScoreText = this.add.text(300, 16, '', {fontsize: '30px', fontFamily: 'game_font', fill: '#FFFF00'});
    this.FinalWinTeam = this.add.text(350, 300, '', {fontsize: '1000px', fontFamily: 'game_font', fill: '#EE0000'});


    this.socket.on('updateScore', function (scores) {
      self.whiteScoreText.setText('White: ' + scores.white);
      self.yellowScoreText.setText('Yellow: ' + scores.yellow);
    });

    this.socket.on('winTeam', function (winteam) {
      self.FinalWinTeam.setText('Team '+ winteam[0] + ' Wins');
      delay(1500).then(() => {
        self.FinalWinTeam.setText(null);
      })
    });

    this.socket.on('coin', function (coin, key) {
      if (self.coin[key]) self.coin[key].destroy();
      if (coin == 6){
        for (let i = 1; i < 6 + 1; i++) {
          self.coin[i].destroy();
        }
      }
      self.coin[key] = self.physics.add.image(coin.x, coin.y, 'coin').setDisplaySize(30, 30);
    });

    this.socket.on('renderBullets', function (update_b) {
      // create bullets
      for (let i = 0; i < update_b.length; i++) {
        if (!self.bullets[i]) {
          self.bullets[i] = self.physics.add.sprite(update_b[i].x, update_b[i].y, 'bullet').setDisplaySize(15, 15);
        } else {
          self.bullets[i].x = update_b[i].x;
          self.bullets[i].y = update_b[i].y;
        }
      }

      // destroy excess bullet render.
      for (let i = update_b.length; i < self.bullets.length; i++) {
        self.bullets[i].destroy();
        self.bullets.splice(i, 1);
        i--;
      }
    });

    // socket on player gets hitted
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

  public update() {

    if (this.bro) {
      if (this.cursors.left.isDown) {
        this.bro.setVelocityX(-200);
        this.bro.flipX = true;
        this.socket.emit('flip', {angle: this.bro.flipX});
      } else if (this.cursors.right.isDown) {
        this.bro.setVelocityX(200);
        this.bro.flipX = false;
        this.socket.emit('flip', {angle: this.bro.flipX});
      }

      if (this.cursors.up.isDown) {
        this.bro.setVelocityY(-500);
      } else if (this.cursors.down.isDown) {
        this.bro.setVelocityY(200);
      }

      this.physics.world.wrap(this.bro, 5);

      let x = this.bro.x;
      let y = this.bro.y;

      if (this.bro.oldPosition && (x !== this.bro.oldPosition.x || y !== this.bro.oldPosition.y)) {
        this.socket.emit('move', {x: this.bro.x, y: this.bro.y});
      }
      this.bro.oldPosition = {
        x: this.bro.x,
        y: this.bro.y,
      };

      if (this.cursors.shift.isDown && !this.bro.shot) {
        let speed_x;
        if (this.bro.flipX === true) {
          speed_x = Math.cos(90 + Math.PI / 2) * 20;
        } else {
          speed_x = Math.cos(270 + Math.PI / 2) * 60;
        }
        this.bro.shot = true;
        this.socket.emit('fire', {x: this.bro.x, y: this.bro.y, angle: this.bro.rotation, speed_x: speed_x, speed_y: 0})
      }
      if (!this.cursors.shift.isDown) this.bro.shot = false;

    }
  }

  addOtherPlayers(playerInfo) {
    this.otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(50, 37);
    if (playerInfo.team === 'white') {
      this.otherPlayer.setTint(0xFFFAFA);
    } else {
      this.otherPlayer.setTint(0xFFFF00);
    }
    this.otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(this.otherPlayer);
  }
}
