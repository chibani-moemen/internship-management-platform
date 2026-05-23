import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, forkJoin, of, shareReplay, switchMap } from 'rxjs';

import { StudentService } from '../../services/student';
import { CompanyService } from '../../services/company';
import { RequestService, InternshipRequest } from '../../services/request';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent {

  error = '';
  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(
    private studentService: StudentService,
    private companyService: CompanyService,
    private requestService: RequestService
  ) {}

  vm$ = this.refresh$.pipe(
    switchMap(() => {
      this.error = '';

      return forkJoin({
        students: this.studentService.getAll(),
        companies: this.companyService.getAll(),
        pendingAdmin: this.requestService.getByStatus('COMPANY_ACCEPTED'),
        approved: this.requestService.getByStatus('ISET_APPROVED'),
        rejected: this.requestService.getByStatus('ISET_REJECTED')
      }).pipe(
        switchMap((data) => {
          const students = Array.isArray(data.students) ? data.students : [];
          const companies = Array.isArray(data.companies) ? data.companies : [];
          const pendingAdmin = Array.isArray(data.pendingAdmin) ? data.pendingAdmin : [];
          const approved = Array.isArray(data.approved) ? data.approved : [];
          const rejected = Array.isArray(data.rejected) ? data.rejected : [];

          return of({
            totalStudents: students.length,
            totalCompanies: companies.length,
            totalPendingAdmin: pendingAdmin.length,
            totalApproved: approved.length,
            totalRejected: rejected.length,
            pendingAdminRequests: pendingAdmin
          });
        })
      );
    }),
    shareReplay(1)
  );

  reload() {
    this.refresh$.next();
  }

  trackByRequestId(index: number, item: InternshipRequest) {
    return item.id;
  }
}