import { Routes } from '@angular/router';

import { List } from './pages/list/list';
import { Create } from './pages/create/create';
import { Edit } from './pages/edit/edit';

export const MOTORCYCLES_ROUTES: Routes = [
  { path: '', component: List },
  { path: 'crear', component: Create }, 
  { path: 'editar/:id', component: Edit } 
];  