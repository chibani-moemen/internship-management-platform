import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StudentService, Student } from '../../services/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.css'],
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];

  // ✅ form model: زدنا password
  form: any = { firstName: '', lastName: '', email: '', password: '' };

  editingId: number | null = null;

  message = '';
  error = '';

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.students = data;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.error = 'Erreur: ما نجمناش نجيبو الليست ❌';
          this.cdr.detectChanges();
        });
      },
    });
  }

  onSubmit(): void {
    this.message = '';
    this.error = '';

    // ✅ validation basic
    if (
      !this.form.firstName?.trim() ||
      !this.form.lastName?.trim() ||
      !this.form.email?.trim()
    ) {
      this.error = 'Erreur: vérifie les champs ❌';
      return;
    }

    // ✅ create يلزمو password
    if (!this.editingId && !this.form.password?.trim()) {
      this.error = 'Password obligatoire عند الإضافة ❌';
      return;
    }

    if (this.editingId) {
      // ✅ UPDATE
      // ملاحظة: backend يبدّل password كان إذا تبعث password مش فارغة
      this.studentService.update(this.editingId, this.form).subscribe({
        next: () => {
          this.zone.run(() => {
            this.message = 'Update OK ✅';
            this.cancelEdit();
            this.refresh();
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.zone.run(() => {
            this.error = 'Update فشل ❌';
            this.cdr.detectChanges();
          });
        },
      });
    } else {
      // ✅ CREATE
      this.studentService.create(this.form).subscribe({
        next: () => {
          this.zone.run(() => {
            this.message = 'Student ajouté ✅';
            this.form = { firstName: '', lastName: '', email: '', password: '' };
            this.refresh();
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.zone.run(() => {
            this.error = 'Ajout فشل ❌';
            this.cdr.detectChanges();
          });
        },
      });
    }
  }

  editStudent(s: Student): void {
    this.editingId = (s.id ?? null) as any;

    // ✅ ما نعبيوش password (ما نحبّوش نعرّضوها)
    this.form = {
      id: s.id,
      firstName: s.firstName ?? '',
      lastName: s.lastName ?? '',
      email: s.email ?? '',
      password: '' // خليها فارغة
    };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = { firstName: '', lastName: '', email: '', password: '' };
  }

  deleteStudent(id?: number): void {
    if (!id) return;

    this.studentService.delete(id).subscribe({
      next: () => {
        this.zone.run(() => {
          this.message = 'Delete OK ✅';
          if (this.editingId === id) this.cancelEdit();
          this.refresh();
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.error = 'Delete فشل ❌';
          this.cdr.detectChanges();
        });
      },
    });
  }

  trackById(index: number, s: Student): number {
    return (s.id ?? index) as number;
  }
  isAdmin(): boolean {
  return localStorage.getItem('role') === 'ADMIN';
  }

}
