import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {GameService} from "../_services/game.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  currentComponent: any;

  ngOnInit() {
  }

  constructor(private toastr: ToastrService, private gameService: GameService) {
  }


  destroyGame(component: String) {
    this.gameService.destoryGame();

  }
}
