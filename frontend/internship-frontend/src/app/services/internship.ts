import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Internship {
  id?: number;
  title: string;
  description: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  studentId: number;
  companyId: number;
}

@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  private baseUrl = '/api/internships';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  create(payload: Internship): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  update(id: number, body: Internship) {
  return this.http.put(`/api/internships/${id}`, body);
}

}
