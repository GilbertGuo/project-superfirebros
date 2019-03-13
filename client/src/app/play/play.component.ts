import {Component, ViewChild, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {preload} from "./game/scene/preload";
import {create} from "./game/scene/create";
import {update} from "./game/scene/update";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {
  @ViewChild('mygame') mygame: ElementRef;

  title = 'angular-phaser';

  game: Phaser.Game;

  public readonly gameConfig: GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    } ,
    parent: 'phaser',
  };

  ngOnInit(): void {
    this.game = new Phaser.Game(this.gameConfig);
  }

  ngOnDestroy() {
    this.game.destroy(true);
  }


}
