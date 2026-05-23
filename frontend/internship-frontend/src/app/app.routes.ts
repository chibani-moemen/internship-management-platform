import { Routes } from '@angular/router';

import { StudentListComponent } from './pages/student-list/student-list';
import { CompanyListComponent } from './pages/company-list/company-list';
import { InternshipListComponent } from './pages/internship-list/internship-list';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

import { CompanyRequestsComponent } from './pages/company-requests/company-requests';
import { AdminRequestsComponent } from './pages/admin-requests/admin-requests';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

import { StudentSkillsComponent } from './pages/student-skills/student-skills';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard';
import { CompanySkillsComponent } from './pages/company-skills/company-skills';
import { CompanyDashboardComponent } from './pages/company-dashboard/company-dashboard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { AdminSkillsComponent } from './pages/admin-skills/admin-skills';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // public
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ✅ ADMIN فقط
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },

  // ✅ STUDENT و ADMIN
  {
    path: 'companies',
    component: CompanyListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STUDENT'] }
  },

  // ✅ ADMIN فقط
  {
    path: 'internships',
    component: InternshipListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },

  // ✅ COMPANY فقط
  {
    path: 'company-requests',
    component: CompanyRequestsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['COMPANY'] }
  },

  // ✅ ADMIN فقط
  {
    path: 'admin-requests',
    component: AdminRequestsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },

  // ✅ STUDENT Skills Page (لازم قبل wildcard)
{
  path: 'student-skills',
  component: StudentSkillsComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['STUDENT'] }
},
{
  path: 'student-dashboard',
  component: StudentDashboardComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['STUDENT'] }
},
{
  path: 'company-skills',
  component: CompanySkillsComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['COMPANY'] }
},
{
  path: 'company-dashboard',
  component: CompanyDashboardComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['COMPANY'] }
},
{
  path: 'admin-dashboard',
  component: AdminDashboardComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] }
},
{
  path: 'admin-skills',
  component: AdminSkillsComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] }
},
  // fallback (لازم تبقى آخر حاجة)
  { path: '**', redirectTo: 'login' }
];