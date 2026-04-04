import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../../../core/services/auth'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule], // solo lo necesario
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.css'],
})

export class Cliente {

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