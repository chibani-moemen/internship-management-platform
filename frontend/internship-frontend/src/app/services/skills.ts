import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Skill {
  id?: number;
  name: string;
  weight: number;
}

export interface SkillsUpdateDto {
  skillIds: number[];
}

@Injectable({ providedIn: 'root' })
export class SkillsService {
  private skillsUrl = '/api/skills';
  private studentsUrl = '/api/students';
  private companiesUrl = '/api/companies';

  constructor(private http: HttpClient) {}

  // ✅ GET all skills
  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.skillsUrl);
  }

  // ✅ ADMIN: create new skill
  createSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(this.skillsUrl, skill);
  }

  // ✅ ADMIN: update existing skill
  updateSkill(id: number, skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.skillsUrl}/${id}`, skill);
  }

  // ✅ ADMIN: delete skill
  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.skillsUrl}/${id}`);
  }

  // ✅ STUDENT: update personal skills
  updateStudentSkills(studentId: number, skillIds: number[]): Observable<any> {
    const body: SkillsUpdateDto = { skillIds };
    return this.http.put(`${this.studentsUrl}/${studentId}/skills`, body);
  }

  // ✅ COMPANY: update required skills
  updateCompanySkills(companyId: number, skillIds: number[]): Observable<any> {
    const body: SkillsUpdateDto = { skillIds };
    return this.http.put(`${this.companiesUrl}/${companyId}/skills`, body);
  }
}