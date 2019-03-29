import {Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ChatService} from '../_services/chat.service';
import {WebsocketService} from "../_services/websocket.service";
import {UserService} from "../_services/user.service";
import {SpectateScene} from "./spectate";

@Component({
  selector: 'app-spectate',
  templateUrl: './spectate.component.html',
  styleUrls: ['./spectate.component.css']
})

export class SpectateComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('phaser') phaser: ElementRef;

  title = 'phaser';

  game: Phaser.Game;

  public readonly gameConfig: GameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 650,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 0},
        debug: false,
      }
    },

    parent: 'phaser',

  };
  private scene: SpectateScene;

  currentUser: any;
  get_messages: any;

  constructor(private chat: ChatService, private socketService: WebsocketService, private userService: UserService) {
  }

  ngOnInit() {
    if (this.userService.userProfile.name) {
      this.currentUser = this.userService.userProfile.name;
    }
    this.chat.init();
    this.get_messages = this.socketService.messages;

    this.chat.messages.subscribe(msg => {
      console.log(msg);
    });

    this.game = new Phaser.Game(this.gameConfig);

  }

  sendMessage(message) {
    this.chat.sendMsg(message);
  }


  ngOnDestroy() {
    this.socketService.disconnet();

    this.scene.socket.disconnect();
    this.game.destroy(true);
  }

  ngAfterViewInit() {
    this.scene = new SpectateScene();
    this.game.events.once('ready', () => {
      this.game.scene.add('Scene', this.scene, true);
    });
  }
}
