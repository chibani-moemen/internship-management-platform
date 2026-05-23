import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { AuthService, Role } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  form: { role: Role; email: string; password: string } = {
    role: 'STUDENT',
    email: '',
    password: ''
  };

  message$ = new BehaviorSubject<string>('');
  error$ = new BehaviorSubject<string>('');

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.message$.next('');
    this.error$.next('');

    if (!this.form.email?.trim() || !this.form.password?.trim()) {
      this.error$.next('Email و Password obligatoire ❌');
      return;
    }

    this.auth.login({
      role: this.form.role,
      email: this.form.email.trim(),
      password: this.form.password
    }).subscribe({
      next: (res) => {
        this.message$.next(`Login ${res.role} ✅`);
        this.error$.next('');

        const target =
          res.role === 'STUDENT' ? '/student-dashboard' :
          res.role === 'COMPANY' ? '/company-dashboard' :
          res.role === 'ADMIN'   ? '/admin-dashboard' :
          '/login';

        this.router.navigateByUrl(target);
      },
      error: (err) => {
        console.error(err);
        this.error$.next(err?.error?.message || err?.error || 'Login فشل ❌');
      }
    });
  }
}