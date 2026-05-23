import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
})
export class AppComponent {

  constructor(private router: Router) {
  console.log('ROUTES CONFIG =', this.router.config);
}

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('role') === 'ADMIN';
  }

  isStudent(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('role') === 'STUDENT';
  }

  isCompany(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('role') === 'COMPANY';
  }

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  localStorage.removeItem('userId');
  this.router.navigateByUrl('/login'); // ✅ بدل window.location
}
}