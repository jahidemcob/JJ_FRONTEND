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
    private authService: AuthService
  ) {}

  login() {
    console.log(this.username, this.password);

    const data = {
      username: this.username,
      clave: this.password
    };

    this.authService.login(data).subscribe({
      next: (res: any) => {
        console.log('LOGIN OK:', res);

        // 🔥 Guardar token
        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        // 🔥 Guardar usuario completo
        localStorage.setItem('usuario', JSON.stringify(res));

        // 🔥 Obtener rol del backend
        const rolBackend = (res.role || res.rol || 'cliente').toLowerCase();

        // 🔥 Mapear rol a rutas del frontend
        const roleMap: any = {
          administrador: 'admin',
          empleado: 'empleado',
          cliente: 'cliente'
        };

        const rol = roleMap[rolBackend] || 'cliente';

        // 🔥 Guardar rol correcto
        localStorage.setItem('rol', rol);

        // 🔥 Redirección automática
        this.router.navigate([`/${rol}`]);
      },
      error: (err) => {
        console.error('ERROR LOGIN:', err);
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
}