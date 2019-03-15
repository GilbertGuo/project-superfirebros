import {Injectable} from '@angular/core';
import {preload} from "../play/game/scene/preload";
import {create} from "../play/game/scene/create";
import {update} from "../play/game/scene/update";


@Injectable({
  providedIn: 'root'
})
export class GameService {
  game: Phaser.Game;
  private static socket: any;


  public readonly gameConfig: GameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 410,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 0},
        debug: false,
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    parent: 'phaser',
  };

  constructor() {
  }

  createGame() {
    this.destoryGame();
    this.game = new Phaser.Game(this.gameConfig);

  }

  destoryGame() {
    if (this.game) {
      GameService.disconnect();
      this.game.destroy(true);
    }
  }

  static setSocket(socket) {
    if(!this.socket) {
      this.socket = socket;
    }
  }

  static disconnect() {
    this.socket.disconnect();
  }


}
