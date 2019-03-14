import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {preload} from "./game/scene/preload";
import {create} from "./game/scene/create";
import {update} from "./game/scene/update";


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy{
  @ViewChild('mygame') mygame: ElementRef;

  title = 'angular-phaser';

  game: Phaser.Game;

  public readonly gameConfig: GameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 430,
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
