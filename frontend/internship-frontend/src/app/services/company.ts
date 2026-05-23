import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Company {
  id?: number;
  name: string;
  address: string;
  email: string;
  password?: string;
}

export interface CompanyMatch {
  companyId: number;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  score: number;               // percentage
  matchingSkills: string[];    // always array
}

@Injectable({ providedIn: 'root' })
export class CompanyService {

  private baseUrl = '/api/companies';

  constructor(private http: HttpClient) {}

  // ADMIN CRUD
  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.baseUrl);
  }

  create(company: Company): Observable<Company> {
    return this.http.post<Company>(this.baseUrl, company);
  }

  update(id: number, body: Company): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ STUDENT matching
  getMatch(studentId: number): Observable<CompanyMatch[]> {
    return this.http.get<CompanyMatch[]>(`${this.baseUrl}/match/${studentId}`);
  }
  getById(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}
}
