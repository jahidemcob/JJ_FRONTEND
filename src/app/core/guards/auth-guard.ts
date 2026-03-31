import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const rol = localStorage.getItem('rol');

  // ❌ No está logueado
  if (!rol) {
    return router.createUrlTree(['/login']);
  }

  // 👇 Obtener rol permitido desde la ruta
  const allowedRoles = route.data?.['roles'] as string[];

  // ❌ Si el rol no está permitido
  if (allowedRoles && !allowedRoles.includes(rol)) {
    return router.createUrlTree([`/${rol}`]);
  }

  // ✅ Todo bien
  return true;
};