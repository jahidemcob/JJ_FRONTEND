import { Routes } from '@angular/router';

import { ListaUsuarios } from './pages/lista-usuarios/lista-usuarios';
import { CrearUsuario } from './pages/crear-usuario/crear-usuario';
import { EditarUsuario } from './pages/editar-usuario/editar-usuario';

export const USUARIOS_ROUTES: Routes = [
  { path: '', component: ListaUsuarios },
  { path: 'crear', component: CrearUsuario },
  { path: 'editar/:id', component: EditarUsuario }
];