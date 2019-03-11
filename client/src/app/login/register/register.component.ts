import {Component, OnInit} from '@angular/core';
import {User} from "../../user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../_services/user.service";
import {min} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  success = false;
  registerForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;

    if(this.registerForm.invalid) {
      return;
    } else {
      this.success = true;
    }
  }

  register() {
    if (this.success) {
      let newUser = new User(
        this.registerForm.controls.username.value,
        this.registerForm.controls.password.value,
        this.registerForm.controls.email.value
      );
      this.userService.register(newUser);
      console.log('registered');
    }
  }

}
