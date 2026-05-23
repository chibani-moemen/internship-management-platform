import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class StudentService {

  private baseUrl = '/api/students';

  constructor(private http: HttpClient) {}

  // ADMIN list
  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  // ✅ هذا هو اللي ينقص
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  update(id: number, body: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}