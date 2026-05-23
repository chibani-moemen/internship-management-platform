import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, switchMap, shareReplay, of, tap } from 'rxjs';

import { SkillsService } from '../../services/skills';
import { StudentService } from '../../services/student';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-student-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-skills.html',
  styleUrls: ['./student-skills.css']
})
export class StudentSkillsComponent {

  message = '';
  error = '';

  selected = new Set<number>();

  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(
    private skillsService: SkillsService,
    private studentService: StudentService,
    private auth: AuthService
  ) {}

  vm$ = this.refresh$.pipe(
    switchMap(() => {

      const studentId = this.auth.userId;

      if (!studentId) {
        this.error = 'Student ID not found ❌';
        return of({ skills: [] });
      }

      return this.studentService.getById(studentId).pipe(
        switchMap((student: any) => {

          // ✅ نعلّم skills القديمة
          this.selected = new Set(
            (student.skills ?? []).map((s: any) => s.id)
          );

          return this.skillsService.getAllSkills().pipe(
            switchMap((skills) => of({ skills }))
          );
        })
      );
    }),
    shareReplay(1)
  );

  toggle(skillId: number, checked: boolean) {
    if (checked) this.selected.add(skillId);
    else this.selected.delete(skillId);
  }

  save() {

    const studentId = this.auth.userId;

    if (!studentId) {
      this.error = 'Student ID missing ❌';
      return;
    }

    const skillIds = Array.from(this.selected);

    this.skillsService.updateStudentSkills(studentId, skillIds).subscribe({
      next: () => {
        this.message = 'Skills updated ✅';
      },
      error: () => {
        this.error = 'Update failed ❌';
      }
    });
  }

  reload() {
    this.refresh$.next();
  }
}