import {Component, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../user.model";

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

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // this.userService.getUsers().subscribe(user => {
    //   this.users = user;
    //   console.log(this.users);
    // })
  }

  onSubmit() {
    this.submitted = true;

    if(this.loginForm.invalid) {
      return;
    } else {
      this.success = true;
    }
  }

  login() {
    this.userService.login();
  }

}
