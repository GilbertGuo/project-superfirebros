import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from "rxjs";
import {Message} from "@angular/compiler/src/i18n/i18n_ast";

// import { environment } from "../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public messages = [];

  private socket;

  constructor() {
  }

  connect(): Subject<MessageEvent> {
    this.socket = io('https://localhost:9000');

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        console.log("Received message from Websocket Server");
        this.messages.push(data.text);
        console.log(this.messages);
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });

    let observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable);
  }

  disconnet() {
    this.socket.disconnect();
  }

}
