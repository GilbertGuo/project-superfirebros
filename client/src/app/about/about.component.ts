import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UtilityService} from "../_services/utility.service";


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit{


  constructor(private utility:UtilityService){}

  ngOnInit(): void {
    this.utility.leaveHome();
  }



}
