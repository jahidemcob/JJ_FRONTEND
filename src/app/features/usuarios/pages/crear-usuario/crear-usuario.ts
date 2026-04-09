import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioCreate } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-usuario.html',
  styleUrls: ['./crear-usuario.css'],
})
export class CrearUsuario {

  usuario: UsuarioCreate = {
    idRol: null as any, // 🔥 importante para validación
    nombre: '',
    nombreUsuario: '',
    telefono: '',
    correo: '',
    clave: '',
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  guardar(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched(); // 🔥 activa errores
      return;
    }

    this.usuarioService.registerUser(this.usuario).subscribe({
      next: () => {
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        console.error('Error creando usuario:', err);
      }
    });
  }
}