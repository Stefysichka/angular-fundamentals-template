import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @ViewChild('loginForm') public loginForm!: NgForm;

  eye = faEye;
  eyeSlash = faEyeSlash;

  showPassword = false;

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form Submitted!', form.value);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
