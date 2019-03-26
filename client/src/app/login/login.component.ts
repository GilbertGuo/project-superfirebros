import {Component, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../user.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginStatus: any;
  user: any;
  loginForm: FormGroup;
  submitted = false;
  success = false;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private authService: AuthService) {
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

  googleAuth() {
    this.userService.signInWithGoogle();
  }

  login() {
    if (!this.userService.socialSignIn) {
      if (this.success) {
        let user = new User(
          this.loginForm.controls.username.value,
          this.loginForm.controls.password.value,
          ""
        );
        this.userService.login(user).subscribe((res) => {
          this.loginStatus = res;
          if (this.loginStatus.success) {
            this.userService.setProfile({name: this.loginStatus.name, email: this.loginStatus.email});
            this.loginStatus = this.loginStatus.success;
            this.toastr.info("Hey, you just logged in.");
            this.router.navigate(['/profile']);
          }
        })
      } else {
        this.authService.authState.subscribe((user) => {
          this.user = user;
          console.log(user);
          this.loginStatus = (user != null);
        });
      }
    }
  }

  toProfile() {
    this.router.navigate(['/profile']);
  }

}
