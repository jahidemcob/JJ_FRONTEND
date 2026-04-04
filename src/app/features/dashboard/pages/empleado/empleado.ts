import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-empleado',
  imports: [CommonModule], 
  templateUrl: './empleado.html',
  styleUrl: './empleado.css',
})
export class Empleado {

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
