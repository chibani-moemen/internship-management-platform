import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type Role = 'ADMIN' | 'STUDENT' | 'COMPANY';

export interface LoginRequest {
  role: Role;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: Role;
  userId?: number | null;   // ✅ NEW
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, body).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('email', res.email);

        // ✅ store userId
        if (res.userId !== undefined && res.userId !== null) {
          localStorage.setItem('userId', String(res.userId));
        } else {
          localStorage.removeItem('userId');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');   // ✅ NEW
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get role(): Role | null {
    return localStorage.getItem('role') as Role | null;
  }

  get email(): string | null {
    return localStorage.getItem('email');
  }

  // ✅ NEW getter
  get userId(): number | null {
    const v = localStorage.getItem('userId');
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
}