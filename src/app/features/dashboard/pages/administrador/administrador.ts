import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth'; 

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css'],
})
export class Administrador {

  vistaActual: string = 'Bienvenido';
  menuAbierto: boolean = false;

  constructor(private authService: AuthService) {} // inyecta el servicio

  cambiarVista(vista: string) {
    this.vistaActual = vista;
    this.menuAbierto = false;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  // ✅ Llamamos al servicio para cerrar sesión
  cerrarSesion() {
    this.authService.logout();
  }
}

