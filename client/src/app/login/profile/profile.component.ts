import {Component, OnInit} from '@angular/core';
import {UserService} from "../../_services/user.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {UtilityService} from "../../_services/utility.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  playerName: String;
  playerEmail: String;

  constructor(private userService: UserService,
              private router:Router,
              public utility:UtilityService) {
  }

  ngOnInit() {
    this.utility.leaveHome();
    let profile = this.userService.getProfile().subscribe((profile) => {
      if(profile && profile.name && profile.email) {
        this.playerName = profile.name;
        this.playerEmail = profile.email;
      } else {
        this.toHome();
      }
    })
  }

  logout() {
    this.userService.logout().subscribe((res) => {
      this.utility.backHome();
      this.toHome();
    })
  }

  toHome() {
    this.router.navigate(['/']);
  }
}
