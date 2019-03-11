import { Injectable } from '@angular/core';
import { Playerposition } from '../play/Playerposition';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }
  player: Playerposition = {
    x: 10,
    y: 120
  };

  createPlayer(): void {

  }
}
