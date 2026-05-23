import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap, shareReplay, of } from 'rxjs';

import { AuthService } from '../../services/auth';
import { RequestService, InternshipRequest } from '../../services/request';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-dashboard.html',
  styleUrls: ['./company-dashboard.css']
})
export class CompanyDashboardComponent {

  error = '';
  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(
    private auth: AuthService,
    private requestService: RequestService
  ) {}

  vm$ = this.refresh$.pipe(
    switchMap(() => {
      const companyId = this.auth.userId;

      if (!companyId) {
        this.error = 'Company ID مش موجود.. اعمل login من جديد ❌';
        return of({
          total: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
          pendingRequests: [] as InternshipRequest[],
          topMatches: [] as any[]
        });
      }

      this.error = '';

      return this.requestService.getByCompany(companyId).pipe(
        switchMap((requests) => {
          const list = Array.isArray(requests) ? requests : [];

          const total = list.length;
          const pendingRequests = list.filter(r => r.status === 'PENDING');
          const pending = pendingRequests.length;
          const accepted = list.filter(r => r.status === 'COMPANY_ACCEPTED').length;
          const rejected = list.filter(r => r.status === 'COMPANY_REJECTED').length;

          // ✅ ناخذو الطلبة اللي بعثو requests فقط، بلا تكرار
          const seen = new Set<number>();
          const uniqueStudents = list
            .filter(r => r?.student?.id)
            .filter(r => {
              const studentId = Number(r.student.id);
              if (seen.has(studentId)) return false;
              seen.add(studentId);
              return true;
            });

          const topMatches = uniqueStudents
            .map((r) => {
              const student = r.student;
              const company = r.company;

              const matchingSkills = this.getMatchingSkills(student, company);
              const score = this.getMatchScore(student, company);

              return {
                studentId: student?.id,
                firstName: student?.firstName ?? '',
                lastName: student?.lastName ?? '',
                email: student?.email ?? '',
                score,
                matchingSkills
              };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

          return of({
            total,
            pending,
            accepted,
            rejected,
            pendingRequests,
            topMatches
          });
        })
      );
    }),
    shareReplay(1)
  );

  reload() {
    this.refresh$.next();
  }

  private getMatchingSkills(student: any, company: any): string[] {
    const studentSkills = Array.isArray(student?.skills) ? student.skills : [];
    const requiredSkills = Array.isArray(company?.requiredSkills) ? company.requiredSkills : [];

    if (studentSkills.length === 0 || requiredSkills.length === 0) return [];

    const studentIds = new Set(studentSkills.map((s: any) => s.id));

    return requiredSkills
      .filter((s: any) => studentIds.has(s.id))
      .map((s: any) => s.name);
  }

  private getMatchScore(student: any, company: any): number {
    const studentSkills = Array.isArray(student?.skills) ? student.skills : [];
    const requiredSkills = Array.isArray(company?.requiredSkills) ? company.requiredSkills : [];

    if (requiredSkills.length === 0) return 0;

    const studentIds = new Set(studentSkills.map((s: any) => s.id));

    const totalWeight = requiredSkills.reduce((sum: number, s: any) => {
      const w = Number(s?.weight);
      return sum + (Number.isFinite(w) ? w : 1);
    }, 0);

    if (totalWeight === 0) return 0;

    const matchedWeight = requiredSkills
      .filter((s: any) => studentIds.has(s.id))
      .reduce((sum: number, s: any) => {
        const w = Number(s?.weight);
        return sum + (Number.isFinite(w) ? w : 1);
      }, 0);

    return Math.round((matchedWeight / totalWeight) * 100);
  }
}