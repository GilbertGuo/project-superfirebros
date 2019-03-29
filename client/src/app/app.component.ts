import {Component} from '@angular/core';
import {UtilityService} from "./_services/utility.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'super-fire-bros';

  constructor(public utility:UtilityService) {
  }
}
