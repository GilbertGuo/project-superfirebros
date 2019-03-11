import {Component, OnInit} from '@angular/core';
import {UserService} from "../../_services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  playerName: String;
  playerEmail: String;

  constructor(private userService: UserService, private router:Router) {
  }

  ngOnInit() {
    let profile = this.userService.getProfile();
    if (profile) {
      this.playerName = profile.name;
      this.playerEmail = profile.email;
    }
  }

  logout() {
    if(this.userService.logout()) {
      this.router.navigate(['/login']);
    }
  }

}
