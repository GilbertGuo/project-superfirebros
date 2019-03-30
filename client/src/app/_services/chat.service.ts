import {Injectable} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Observable, Subject} from 'rxjs';
import {map} from "rxjs/operators";

// https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketService) {
  }

  init() {
    this.messages = <Subject<any>>this.wsService
      .connect().pipe(
        map((response: any): any => {
          return response;
        }))
  }

  sendMsg(msg) {
    this.messages.next(msg);
  }
}
