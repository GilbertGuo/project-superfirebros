import {Component, OnInit} from '@angular/core';
import {User} from "../../user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../_services/user.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  success = false;
  readyToSubmit = false;
  registerForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private toastr: ToastrService, private route:Router) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      code: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  onSubmit(type: string) {
    this.submitted = true;

    if (type === 'register') {
      if (this.registerForm.invalid) {
        return;
      } else {
        this.success = true;
        this.register();
      }
    } else if (type === 'verify') {
      let email = this.registerForm.controls.email.value;
      this.readyToSubmit = (
        this.registerForm.controls.password.valid
        && this.registerForm.controls.email.valid
        && this.registerForm.controls.username.valid
      );
      if (this.readyToSubmit) {
        this.userService.verifyEmail(email).subscribe(() => {
        });
      }
    }
  }

  register() {
    if (this.success) {
      let newUser = new User(
        this.registerForm.controls.username.value,
        this.registerForm.controls.password.value,
        this.registerForm.controls.email.value,
        this.registerForm.controls.code.value
      );
      this.userService.register(newUser).subscribe((res) => {
        this.toastr.success("Register successfully");
        this.route.navigate(['/login']);
      });
    }
  }


}
