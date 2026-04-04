import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // disponible en toda la app
})
export class AuthService {

  constructor(private router: Router) {}

  logout() {
    // Elimina todos los datos de sesión
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token'); // para cuando conectes backend

    // Redirige a login
    this.router.navigate(['/login']);
  }
}