import {Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {GameScene} from "./game/scene";
import {UtilityService} from "../_services/utility.service";

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
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 0},
        debug: false,
      }
    },

    parent: 'phaser',

  };
  private scene: GameScene;

  constructor(private utility:UtilityService) {
  }

  ngOnInit(): void {
    this.utility.leaveHome();
    this.game = new Phaser.Game(this.gameConfig);
  }

  ngOnDestroy() {
    this.scene.socket.disconnect();
    this.game.destroy(true);
  }

  ngAfterViewInit() {
    this.scene = new GameScene();
    this.game.events.once('ready', () => {
      this.game.scene.add('Scene', this.scene, true);
    });
  }


}
