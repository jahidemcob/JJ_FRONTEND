import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crear-usuario.html',
  styleUrls: ['./crear-usuario.css']
})
export class CrearUsuario {

  usuario = {
    idUsuario: Date.now(),
    idRol: 1,       // 1=Administrador, 2=Empleado, 3=Cliente
    nombre: '',
    usuario: '',
    telefono: '',
    correo: '',
    clave: '',
    activo: true
  };

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  guardar() {
    // Aquí idRol ya se actualiza según lo que selecciones
    this.usuarioService.agregar(this.usuario);
    this.router.navigate(['/admin/usuarios']);
  }
}