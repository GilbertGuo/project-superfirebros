import {Component, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../user.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // loginStatus: boolean = false;
  // users: Object;
  loginForm: FormGroup;
  submitted = false;
  success = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private toastr:ToastrService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.toProfile();
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    } else {
      this.success = true;
      this.login();
    }
  }

  login() {
    if (this.success) {
      let user = new User(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value,
        ""
      );
      this.userService.login(user).subscribe((profile) => {
        console.log("yes, you are in.");
        this.toastr.info("Hey, you just logged in.");
        this.toProfile();
      })
    }
  }

  toProfile() {
    this.userService.isLoggedin().subscribe((res) => {
      if (res) {
        this.router.navigate(['/profile']);
      }
    });
  }

}
