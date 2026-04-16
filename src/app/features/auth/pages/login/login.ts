import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  login() {
    const data = {
      username: this.username,
      clave: this.password,
    };

    this.authService.login(data).subscribe({
      next: () => {
        const ruta = this.authService.getRedirectRoute();
        this.router.navigate([`/${ruta}`]);
      },

      error: (err) => {
        console.error('ERROR LOGIN:', err);

        let errorMessage = 'Ocurrió un error inesperado';
        const backendMessage = err.error?.message;

        if (err.status === 401) {
          errorMessage = backendMessage || 'Usuario o contraseña incorrectos';
        } else if (err.status === 403) {
          errorMessage = backendMessage || 'Usuario desactivado';
        } else if (err.status === 400) {
          errorMessage = backendMessage || 'Datos inválidos';
        } else if (err.status === 404) {
          errorMessage = backendMessage || 'Usuario no encontrado';
        } else if (err.status === 500) {
          errorMessage = backendMessage || 'Error interno del servidor';
        } else {
          errorMessage = backendMessage || errorMessage;
        }

        alert(errorMessage);
      },
    });
  }
}
