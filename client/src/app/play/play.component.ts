import {Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {MyScene} from "./game/scene";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('phaser') phaser: ElementRef;

  title = 'phaser';

  game: Phaser.Game;

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
    parent: 'phaser',
  };
  private scene: MyScene;

  constructor() {
  }

  ngOnInit(): void {
    this.game = new Phaser.Game(this.gameConfig);
  }

  ngOnDestroy() {
    this.scene.socket.disconnect();
    this.game.destroy(true);
  }

  ngAfterViewInit() {
    this.scene = new MyScene();
    this.game.events.once('ready', () => {
      this.game.scene.add('Scene', this.scene, true);
    });
  }


}
