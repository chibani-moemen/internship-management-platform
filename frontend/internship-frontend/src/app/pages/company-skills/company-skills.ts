import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, switchMap, shareReplay, of } from 'rxjs';

import { SkillsService } from '../../services/skills';
import { CompanyService } from '../../services/company';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-company-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-skills.html',
  styleUrls: ['./company-skills.css']
})
export class CompanySkillsComponent {

  message = '';
  error = '';

  selected = new Set<number>();
  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(
    private skillsService: SkillsService,
    private companyService: CompanyService,
    private auth: AuthService
  ) {}

  vm$ = this.refresh$.pipe(
    switchMap(() => {
      const companyId = this.auth.userId;

      if (!companyId) {
        this.error = 'Company ID مش موجود.. اعمل login من جديد ❌';
        return of({ skills: [] as any[] });
      }

      this.error = '';

      return this.companyService.getById(companyId).pipe(
        switchMap((company: any) => {
          // ⚠️ ملاحظة: اسمها requiredSkills في backend
          const oldIds: number[] = Array.isArray(company?.requiredSkills)
            ? company.requiredSkills.map((s: any) => Number(s.id)).filter((x: any) => Number.isFinite(x))
            : [];

          this.selected = new Set<number>(oldIds);

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
    this.message = '';
    this.error = '';

    const companyId = this.auth.userId;
    if (!companyId) {
      this.error = 'Company ID مش موجود.. اعمل login من جديد ❌';
      return;
    }

    const skillIds = Array.from(this.selected);

    this.skillsService.updateCompanySkills(companyId, skillIds).subscribe({
      next: () => {
        this.message = 'Required skills updated ✅';
        this.refresh$.next(); // نعاود نقرا من backend
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || err?.error || 'Update failed ❌';
      }
    });
  }

  reload() {
    this.message = '';
    this.error = '';
    this.refresh$.next();
  }
}