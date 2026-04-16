import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

import { LoginComponent } from './features/auth/pages/login/login';
import { RegisterComponent } from './features/auth/pages/register/register';

// Dashboars de roles
import { Administrador } from './features/dashboard/pages/admin/administrador';
import { Cliente } from './features/dashboard/pages/client/cliente';
import { Empleado } from './features/dashboard/pages/employee/empleado';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: Administrador,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    children: [
      {
      path: 'usuarios',
      loadChildren: () =>
        import('./features/users/users.routes').then(m => m.USUARIOS_ROUTES)
      }
    ]
  },
  { path: 'cliente', component: Cliente, canActivate: [authGuard], data: { roles: ['cliente'] } },
  { path: 'empleado', component: Empleado, canActivate: [authGuard], data: { roles: ['empleado'] } },
];