import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';
import { WebsocketService} from "../websocket.service";
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-spectate',
  templateUrl: './spectate.component.html',
  styleUrls: ['./spectate.component.css']
})

export class SpectateComponent implements OnInit, OnDestroy{

  currentUser:any;
  get_messages: any;
  constructor(private chat: ChatService, private socketService: WebsocketService, private userService:UserService) {
  }

  ngOnInit() {
    if(this.userService.isLoggedin()) {
      this.currentUser = this.userService.userProfile.name;
    }

    this.chat.init();
    this.get_messages = this.socketService.messages;

    this.chat.messages.subscribe(msg => {
      console.log(msg);
    })
  }

  ngOnDestroy() {
    this.socketService.disconnet();
  }

  sendMessage(message) {
    this.chat.sendMsg(message);
  }

}
