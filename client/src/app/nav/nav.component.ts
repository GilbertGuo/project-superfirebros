import { Component, OnInit } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  // constructor() { }

  ngOnInit() {
  }

  constructor(private toastr: ToastrService) {}

  showSuccess() {
    this.toastr.error('About');
    // this.toastr.success('About', '');
  }

}
