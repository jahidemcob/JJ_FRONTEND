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
    idRol: null as any,
    nombre: '',
    nombreUsuario: '',
    telefono: '',
    correo: '',
    clave: '',
  };

  erroresBackend: any = {}; //  errores por campo

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  guardar(form: any) {
    this.erroresBackend = {}; // limpiar errores

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.usuarioService.registerUser(this.usuario).subscribe({
      next: () => {
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        console.error('Error creando usuario:', err);

        if (err.error && err.error.error) {
          const mensaje = err.error.error.toLowerCase();

          // detectar campo según mensaje
          if (mensaje.includes('correo')) {
            this.erroresBackend.correo = err.error.error;
          } else if (mensaje.includes('usuario')) {
            this.erroresBackend.nombreUsuario = err.error.error;
          } else if (mensaje.includes('telefono')) {
            this.erroresBackend.telefono = err.error.error;
          } else {
            this.erroresBackend.general = err.error.error;
          }
        }
      },
    });
  }
}
