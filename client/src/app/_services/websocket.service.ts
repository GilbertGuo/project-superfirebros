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
    this.socket = io('/chat');
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        this.messages.push(data.text);
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
