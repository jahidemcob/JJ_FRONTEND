import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login';
import { RegisterComponent } from './modules/auth/pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];