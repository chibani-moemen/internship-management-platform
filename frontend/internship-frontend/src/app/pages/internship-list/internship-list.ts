import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, switchMap, shareReplay } from 'rxjs';

import { InternshipService, Internship } from '../../services/internship';
import { StudentService, Student } from '../../services/student';
import { CompanyService, Company } from '../../services/company';

@Component({
  selector: 'app-internship-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './internship-list.html',
  styleUrls: ['./internship-list.css']
})
export class InternshipListComponent {

  form: Internship = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    studentId: 0,
    companyId: 0
  };

  editingId: number | null = null;

  message = '';
  error = '';

  students: Student[] = [];
  companies: Company[] = [];

  private refresh$ = new BehaviorSubject<void>(undefined);

  internships$ = this.refresh$.pipe(
    switchMap(() => this.internshipService.getAll()),
    shareReplay(1)
  );

  constructor(
    private internshipService: InternshipService,
    private studentService: StudentService,
    private companyService: CompanyService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.loadStudents();
    this.loadCompanies();
  }

  private ui(fn: () => void) {
    this.zone.run(() => {
      fn();
      this.cdr.detectChanges();
    });
  }

  reload() {
    this.refresh$.next();
    // ✅ forcing UI update (باش ما يستناش click)
    this.cdr.detectChanges();
  }

  loadStudents() {
    this.studentService.getAll().subscribe({
      next: (data) => this.ui(() => { this.students = data; }),
      error: () => this.ui(() => { this.error = 'Erreur chargement students ❌'; })
    });
  }

  loadCompanies() {
    this.companyService.getAll().subscribe({
      next: (data) => this.ui(() => { this.companies = data; }),
      error: () => this.ui(() => { this.error = 'Erreur chargement companies ❌'; })
    });
  }

  onSubmit() {
    this.ui(() => { this.message = ''; this.error = ''; });

    if (!this.form.studentId || !this.form.companyId) {
      this.ui(() => { this.error = 'اختار Student و Company ❌'; });
      return;
    }

    // ✅ date validation frontend (حتى قبل backend)
    if (this.form.startDate && this.form.endDate && this.form.endDate < this.form.startDate) {
      this.ui(() => { this.error = 'End Date لازم تكون بعد Start Date ❌'; });
      return;
    }

    if (this.editingId) {
      this.internshipService.update(this.editingId, this.form).subscribe({
        next: () => this.ui(() => {
          this.message = 'Internship updated ✅';
          this.cancelEdit();
          this.reload();
        }),
        error: (err) => this.ui(() => {
          // ✅ message واضح للـ overlap / date / etc
          const backendMsg = err?.error;
          this.error = (typeof backendMsg === 'string' && backendMsg.trim())
            ? backendMsg + ' ❌'
            : 'Update failed ❌';
        })
      });
    } else {
      this.internshipService.create(this.form).subscribe({
        next: () => this.ui(() => {
          this.message = 'Internship ajouté ✅';
          this.form = { title: '', description: '', startDate: '', endDate: '', studentId: 0, companyId: 0 };
          this.reload();
        }),
        error: (err) => this.ui(() => {
          const backendMsg = err?.error;
          this.error = (typeof backendMsg === 'string' && backendMsg.trim())
            ? backendMsg + ' ❌'
            : 'Erreur: vérifie les champs ❌';
        })
      });
    }
  }

  editInternship(i: any) {
    this.ui(() => {
      this.editingId = i.id;

      this.form = {
        title: i.title ?? '',
        description: i.description ?? '',
        startDate: i.startDate ?? '',
        endDate: i.endDate ?? '',
        studentId: i.student?.id ?? 0,
        companyId: i.company?.id ?? 0
      };

      this.message = '';
      this.error = '';
    });
  }

  cancelEdit() {
    this.ui(() => {
      this.editingId = null;
      this.form = { title: '', description: '', startDate: '', endDate: '', studentId: 0, companyId: 0 };
    });
  }

  deleteInternship(id: number) {
    this.ui(() => { this.message = ''; this.error = ''; });

    this.internshipService.delete(id).subscribe({
      next: () => this.ui(() => {
        this.message = 'Internship supprimé ✅';
        if (this.editingId === id) this.cancelEdit();
        this.reload();
      }),
      error: (err) => this.ui(() => {
        const backendMsg = err?.error;
        this.error = (typeof backendMsg === 'string' && backendMsg.trim())
          ? backendMsg + ' ❌'
          : 'Delete failed ❌';
      })
    });
  }
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }

}
