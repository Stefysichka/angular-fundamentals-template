import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @ViewChild('loginForm') public loginForm!: NgForm;

  showPassword = false;
  errorMsg: string | null = null;   // ✅ додано

  constructor(
    private auth: AuthService,       // ✅ додано
    private router: Router           // ✅ додано
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { email, password } = form.value;

      this.auth.login({ email, password }).subscribe({
        next: () => {
          this.router.navigate(['/courses']);
        },
        error: (err: any) => {       // ✅ явно типізували
          this.errorMsg = err?.error?.errors?.[0] ?? 'Login failed';
        }
      });
    }
  }
}
