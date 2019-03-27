import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {GameService} from "../_services/game.service";
import {UtilityService} from "../utility.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private toastr: ToastrService, private gameService: GameService, public utility: UtilityService) {
  }
}
