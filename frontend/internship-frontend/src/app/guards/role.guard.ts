import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);

  const roleRaw = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const role = (roleRaw ?? '').trim().toUpperCase();
  const allowed = ((route.data?.['roles'] as string[]) ?? []).map(r => r.trim().toUpperCase());

  console.log('[roleGuard]', 'url=', state.url, 'role=', role, 'allowed=', allowed);

  if (allowed.length === 0) return true;

  if (allowed.includes(role)) return true;

  console.log('[roleGuard] ROLE NOT ALLOWED -> redirect based on role');

  if (role === 'COMPANY') return router.parseUrl('/company-requests');
  if (role === 'STUDENT') return router.parseUrl('/companies');
  if (role === 'ADMIN') return router.parseUrl('/students');
  return router.parseUrl('/login');
};