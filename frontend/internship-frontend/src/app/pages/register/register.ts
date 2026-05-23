import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { StudentService } from '../../services/student';
import { CompanyService } from '../../services/company';

type RegisterRole = 'STUDENT' | 'COMPANY';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  form: {
    role: RegisterRole;
    firstName: string;
    lastName: string;
    name: string;
    address: string;
    email: string;
    password: string;
  } = {
    role: 'STUDENT',
    firstName: '',
    lastName: '',
    name: '',
    address: '',
    email: '',
    password: ''
  };

  message$ = new BehaviorSubject<string>('');
  error$ = new BehaviorSubject<string>('');

  constructor(
    private studentService: StudentService,
    private companyService: CompanyService,
    private router: Router
  ) {}

  isStudent(): boolean {
    return this.form.role === 'STUDENT';
  }

  isCompany(): boolean {
    return this.form.role === 'COMPANY';
  }

  onSubmit() {
    this.message$.next('');
    this.error$.next('');

    if (!this.form.email?.trim() || !this.form.password?.trim()) {
      this.error$.next('Email و Password obligatoire ❌');
      return;
    }

    if (this.isStudent()) {
      if (!this.form.firstName?.trim() || !this.form.lastName?.trim()) {
        this.error$.next('First name و Last name obligatoire للطالب ❌');
        return;
      }

      const body = {
        firstName: this.form.firstName.trim(),
        lastName: this.form.lastName.trim(),
        email: this.form.email.trim(),
        password: this.form.password
      };

      this.studentService.create(body as any).subscribe({
        next: () => {
          this.message$.next('Student registered successfully ✅');
          this.error$.next('');
          setTimeout(() => this.router.navigateByUrl('/login'), 700);
        },
        error: (err) => {
          console.error(err);
          this.error$.next(err?.error?.message || err?.error || 'Student registration failed ❌');
        }
      });

      return;
    }

    if (this.isCompany()) {
      if (!this.form.name?.trim() || !this.form.address?.trim()) {
        this.error$.next('Company name و address obligatoire للشركة ❌');
        return;
      }

      const body = {
        name: this.form.name.trim(),
        address: this.form.address.trim(),
        email: this.form.email.trim(),
        password: this.form.password
      };

      this.companyService.create(body as any).subscribe({
        next: () => {
          this.message$.next('Company registered successfully ✅');
          this.error$.next('');
          setTimeout(() => this.router.navigateByUrl('/login'), 700);
        },
        error: (err) => {
          console.error(err);
          this.error$.next(err?.error?.message || err?.error || 'Company registration failed ❌');
        }
      });
    }
  }
}