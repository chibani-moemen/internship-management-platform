import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type RequestStatus =
  | 'PENDING'
  | 'COMPANY_ACCEPTED'
  | 'COMPANY_REJECTED'
  | 'ISET_APPROVED'
  | 'ISET_REJECTED';

export interface InternshipRequest {
  id: number;
  status: RequestStatus;
  createdAt: string;
  student?: any;
  company?: any;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = '/api/requests';

  constructor(private http: HttpClient) {}

  // ✅ Student sends request
  create(studentId: number, companyId: number): Observable<InternshipRequest> {
    return this.http.post<InternshipRequest>(this.baseUrl, { studentId, companyId });
  }

  // ✅ Company sees its requests
  getByCompany(companyId: number): Observable<InternshipRequest[]> {
    return this.http.get<InternshipRequest[]>(`${this.baseUrl}/company/${companyId}`);
  }

  // ✅ Student sees his requests (useful later)
  getByStudent(studentId: number): Observable<InternshipRequest[]> {
    return this.http.get<InternshipRequest[]>(`${this.baseUrl}/student/${studentId}`);
  }

  // ✅ Company actions
  companyAccept(id: number): Observable<InternshipRequest> {
    return this.http.put<InternshipRequest>(`${this.baseUrl}/${id}/company-accept`, {});
  }

  companyReject(id: number): Observable<InternshipRequest> {
    return this.http.put<InternshipRequest>(`${this.baseUrl}/${id}/company-reject`, {});
  }

  // ✅ Admin actions (later)
  isetApprove(id: number): Observable<InternshipRequest> {
    return this.http.put<InternshipRequest>(`${this.baseUrl}/${id}/iset-approve`, {});
  }

  isetReject(id: number): Observable<InternshipRequest> {
    return this.http.put<InternshipRequest>(`${this.baseUrl}/${id}/iset-reject`, {});
  }
  getByStatus(status: string) {
    return this.http.get<InternshipRequest[]>(
      `${this.baseUrl}/status/${status}`
    );
  }

}
