import {Component, ViewChild, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {preload} from "./game/scene/preload";
import {create} from "./game/scene/create";
import {update} from "./game/scene/update";
import {GameService} from "../_services/game.service";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  @ViewChild('phaser') phaser: ElementRef;

  title = 'phaser';

  game: Phaser.Game;

  constructor(private gameService:GameService) {
  }

  ngOnInit(): void {
    this.gameService.createGame();
  }

  ngOnDestroy() {
    this.gameService.destoryGame();
  }


}
