import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  mensaje: string = '';          // 🔴 errores
  mensajeExito: string = '';     // 🟢 éxito

  constructor(private authService: AuthService, private router: Router) {}

  registrar(form: any) {

    // limpiar mensajes anteriores
    this.mensaje = '';
    this.mensajeExito = '';

    // 🔴 Validaciones
    if (form.invalid) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    if (form.value.clave !== form.value.confirmarClave) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    // 🔥 DATA
    const data = {
      Nombre: form.value.nombre,
      NombreUsuario: form.value.usuario,
      Telefono: form.value.telefono,
      Correo: form.value.correo,
      Clave: form.value.clave
    };

    console.log('DATA ENVIADA:', data);

    // 🔥 PETICIÓN
    this.authService.register(data).subscribe({
      next: (res: any) => {
        console.log('REGISTRO OK:', res);

        // 🟢 MENSAJE VERDE
        this.mensajeExito = 'Usuario registrado correctamente';

        // 🧹 LIMPIAR FORMULARIO
        form.reset();
      },
      error: (err) => {
        console.error('ERROR REGISTRO:', err);

        if (err.status === 400) {
          this.mensaje = 'El usuario ya existe o datos inválidos';
        } else {
          this.mensaje = 'Error en el registro';
        }
      }
    });
  }
}