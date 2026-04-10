import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  mensaje: string = '';
  mensajeExito: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  campoActivo: string = '';

  setCampoActivo(campo: string) {
    this.campoActivo = campo;
  }

  registrar(form: any) {
    this.mensaje = '';
    this.mensajeExito = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.mensaje = 'Todos los campos deben estar completos correctamente';
      return;
    }

    if (form.value.clave !== form.value.confirmarClave) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    const data = {
      Nombre: form.value.nombre,
      NombreUsuario: form.value.usuario,
      Telefono: form.value.telefono,
      Correo: form.value.correo,
      Clave: form.value.clave,
    };

    this.authService.register(data).subscribe({
      next: (resp) => {
        console.log('RESPUESTA OK:', resp);

        this.mensajeExito = 'Usuario registrado correctamente';
        this.mensaje = '';
        form.reset();
      },

      error: (err) => {
        console.error('ERROR REGISTRO:', err);

        this.mensaje = err.error?.message || 'El usuario o correo ya existe';

        this.mensajeExito = '';

        this.cdr.detectChanges();

      },
    });
  }
}
