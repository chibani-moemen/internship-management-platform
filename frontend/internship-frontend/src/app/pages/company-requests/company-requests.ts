import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, switchMap, shareReplay, of } from 'rxjs';

import { RequestService } from '../../services/request';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-company-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-requests.html',
  styleUrls: ['./company-requests.css']
})
export class CompanyRequestsComponent {

  message = '';
  error = '';

  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(
    private requestService: RequestService,
    private auth: AuthService
  ) {}

  requests$ = this.refresh$.pipe(
    switchMap(() => {
      const companyId = this.auth.userId;

      if (!companyId) {
        this.error = 'Company ID مش موجود.. اعمل login كشركة من جديد ❌';
        return of([]);
      }

      this.error = '';

      return this.requestService.getByCompany(companyId).pipe(
        switchMap((requests: any[]) => {
          const pendingOnly = Array.isArray(requests)
            ? requests.filter(r => r.status === 'PENDING')
            : [];

          return of(pendingOnly);
        })
      );
    }),
    shareReplay(1)
  );

  reload() {
    this.message = '';
    this.error = '';
    this.refresh$.next();
  }

  accept(id: number) {
    this.message = '';
    this.error = '';

    this.requestService.companyAccept(id).subscribe({
      next: () => {
        this.message = 'Request accepted ✅';
        this.reload();
      },
      error: () => {
        this.error = 'Accept failed ❌';
      }
    });
  }

  reject(id: number) {
    this.message = '';
    this.error = '';

    this.requestService.companyReject(id).subscribe({
      next: () => {
        this.message = 'Request rejected ✅';
        this.reload();
      },
      error: () => {
        this.error = 'Reject failed ❌';
      }
    });
  }

  getMatchingSkills(r: any): string[] {
    const studentSkills = Array.isArray(r?.student?.skills) ? r.student.skills : [];
    const requiredSkills = Array.isArray(r?.company?.requiredSkills) ? r.company.requiredSkills : [];

    if (studentSkills.length === 0 || requiredSkills.length === 0) return [];

    const studentIds = new Set(studentSkills.map((s: any) => s.id));

    return requiredSkills
      .filter((s: any) => studentIds.has(s.id))
      .map((s: any) => s.name);
  }

  getMatchScore(r: any): number {
    const studentSkills = Array.isArray(r?.student?.skills) ? r.student.skills : [];
    const requiredSkills = Array.isArray(r?.company?.requiredSkills) ? r.company.requiredSkills : [];

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