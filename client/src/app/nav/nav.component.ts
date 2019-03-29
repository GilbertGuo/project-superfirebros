import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {UtilityService} from "../_services/utility.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private toastr: ToastrService, public utility:UtilityService) {
  }
}
