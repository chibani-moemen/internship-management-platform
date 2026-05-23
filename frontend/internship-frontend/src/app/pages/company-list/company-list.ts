import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, switchMap, shareReplay, of } from 'rxjs';

import { CompanyService, CompanyMatch } from '../../services/company';
import { RequestService } from '../../services/request';
import { AuthService } from '../../services/auth'; // ✅ NEW

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.css']
})
export class CompanyListComponent implements OnInit {

  // ✅ Admin form
  form: any = { name: '', address: '', email: '', password: '' };
  editingId: number | null = null;

  message = '';
  error = '';

  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(
    private companyService: CompanyService,
    private requestService: RequestService,
    private auth: AuthService // ✅ NEW
  ) {}

  ngOnInit(): void {
    // ✅ auto load matches for student
    if (this.isStudent()) {
      this.reload();
    }
  }

  reload() {
    this.refresh$.next();
  }

  // ✅ Student matches list
  matches$ = this.refresh$.pipe(
    switchMap(() => {
      if (!this.isStudent()) return of<CompanyMatch[]>([]);
      const studentId = this.getUserId();
      if (!studentId) return of<CompanyMatch[]>([]);
      return this.companyService.getMatch(studentId);
    }),
    shareReplay(1)
  );

  // ✅ Admin list
  companies$ = this.refresh$.pipe(
    switchMap(() => this.companyService.getAll()),
    shareReplay(1)
  );

  // ✅ ADMIN create/update
  onSubmit() {
    this.message = '';
    this.error = '';

    if (!this.isAdmin()) {
      this.error = 'Access denied ❌';
      return;
    }

    if (!this.form.name?.trim() || !this.form.address?.trim() || !this.form.email?.trim()) {
      this.error = 'Erreur: vérifie les champs ❌';
      return;
    }

    if (!this.editingId && !this.form.password?.trim()) {
      this.error = 'Password obligatoire عند الإضافة ❌';
      return;
    }

    if (this.editingId) {
      this.companyService.update(this.editingId, this.form).subscribe({
        next: () => {
          this.message = 'Update OK ✅';
          this.cancelEdit();
          this.reload();
        },
        error: () => this.error = 'Update فشل ❌'
      });
    } else {
      this.companyService.create(this.form).subscribe({
        next: () => {
          this.form = { name: '', address: '', email: '', password: '' };
          this.message = 'Company ajouté ✅';
          this.reload();
        },
        error: () => this.error = 'Erreur: vérifie les champs ❌'
      });
    }
  }

  editCompany(c: any) {
    if (!this.isAdmin()) return;

    this.editingId = c.id;
    this.form = {
      name: c.name ?? '',
      address: c.address ?? '',
      email: c.email ?? '',
      password: ''
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { name: '', address: '', email: '', password: '' };
  }

  deleteCompany(id?: number) {
    if (!this.isAdmin()) return;
    if (!id) return;

    this.message = '';
    this.error = '';

    this.companyService.delete(id).subscribe({
      next: () => {
        this.message = 'Company supprimé ✅';
        if (this.editingId === id) this.cancelEdit();
        this.reload();
      },
      error: () => this.error = 'Delete failed ❌'
    });
  }

  // ✅ Student sends request (uses logged in userId)
  sendRequest(companyId: number) {
    this.message = '';
    this.error = '';

    const studentId = this.getUserId();
    if (!studentId) {
      this.error = 'Student id not found (login again) ❌';
      return;
    }

    this.requestService.create(studentId, companyId).subscribe({
      next: (r) => {
        this.message = `Request تبعثت ✅ (status: ${r.status})`;
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error || 'Send request failed ❌';
        this.error = msg;
      }
    });
  }

  // ===== helpers =====
  private getUserId(): number | null {
    return this.auth.userId; // ✅ NEW (single source of truth)
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  isAdmin(): boolean {
    return this.isBrowser() && localStorage.getItem('role') === 'ADMIN';
  }

  isStudent(): boolean {
    return this.isBrowser() && localStorage.getItem('role') === 'STUDENT';
  }
}