import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, switchMap, shareReplay } from 'rxjs';

import { SkillsService, Skill } from '../../services/skills';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-skills.html',
  styleUrls: ['./admin-skills.css']
})
export class AdminSkillsComponent {

  form: Skill = {
    name: '',
    weight: 1
  };

  editingId: number | null = null;

  message = '';
  error = '';

  private refresh$ = new BehaviorSubject<void>(undefined);

  skills$ = this.refresh$.pipe(
    switchMap(() => this.skillsService.getAllSkills()),
    shareReplay(1)
  );

  constructor(private skillsService: SkillsService) {}

  reload() {
    this.refresh$.next();
  }

  onSubmit() {
    this.message = '';
    this.error = '';

    if (!this.form.name?.trim()) {
      this.error = 'Skill name is required ❌';
      return;
    }

    if (this.form.weight !== 1 && this.form.weight !== 2) {
      this.error = 'Weight must be 1 or 2 ❌';
      return;
    }

    const body: Skill = {
      name: this.form.name.trim(),
      weight: this.form.weight
    };

    if (this.editingId) {
      this.skillsService.updateSkill(this.editingId, body).subscribe({
        next: () => {
          this.message = 'Skill updated ✅';
          this.cancelEdit();
          this.reload();
        },
        error: (err) => {
          console.error(err);
          this.error = err?.error || 'Update failed ❌';
        }
      });
    } else {
      this.skillsService.createSkill(body).subscribe({
        next: () => {
          this.message = 'Skill added ✅';
          this.form = { name: '', weight: 1 };
          this.reload();
        },
        error: (err) => {
          console.error(err);
          this.error = err?.error || 'Add failed ❌';
        }
      });
    }
  }

  editSkill(skill: Skill) {
    this.editingId = skill.id ?? null;
    this.form = {
      name: skill.name,
      weight: skill.weight
    };
    this.message = '';
    this.error = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.form = {
      name: '',
      weight: 1
    };
    this.message = '';
    this.error = '';
  }

  deleteSkill(id?: number) {
    if (!id) return;

    this.message = '';
    this.error = '';

    this.skillsService.deleteSkill(id).subscribe({
      next: () => {
        this.message = 'Skill deleted ✅';
        if (this.editingId === id) {
          this.cancelEdit();
        }
        this.reload();
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error || 'Delete failed ❌';
      }
    });
  }
}