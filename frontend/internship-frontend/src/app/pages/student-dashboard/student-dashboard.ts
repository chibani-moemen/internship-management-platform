import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap, shareReplay, of } from 'rxjs';

import { AuthService } from '../../services/auth';
import { StudentService } from '../../services/student';
import { RequestService, InternshipRequest } from '../../services/request';
import { CompanyService, CompanyMatch } from '../../services/company';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboardComponent {

  error = '';
  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(
    private auth: AuthService,
    private studentService: StudentService,
    private requestService: RequestService,
    private companyService: CompanyService
  ) {}

  vm$ = this.refresh$.pipe(
    switchMap(() => {
      const studentId = this.auth.userId;

      if (!studentId) {
        this.error = 'Student ID مش موجود.. اعمل login من جديد ❌';
        return of({
          email: this.auth.email ?? '',
          skills: [] as any[],
          requests: [] as InternshipRequest[],
          matches: [] as CompanyMatch[]
        });
      }

      this.error = '';

      return this.studentService.getById(studentId).pipe(
        switchMap((student: any) => {
          const email = student?.email ?? (this.auth.email ?? '');
          const skills = Array.isArray(student?.skills) ? student.skills : [];

          return this.requestService.getByStudent(studentId).pipe(
            switchMap((requests) => {
              return this.companyService.getMatch(studentId).pipe(
                switchMap((matches) => of({
                  email,
                  skills,
                  requests: Array.isArray(requests) ? requests : [],
                  matches: Array.isArray(matches) ? matches.slice(0, 3) : [] // ✅ Top 3
                }))
              );
            })
          );
        })
      );
    }),
    shareReplay(1)
  );

  reload() {
    this.refresh$.next();
  }
}