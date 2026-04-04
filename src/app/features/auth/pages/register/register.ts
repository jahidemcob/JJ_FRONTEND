import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], 
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  mensaje: string = '';

  registrar(form: any) {

    if (form.invalid) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    if (form.value.clave !== form.value.confirmarClave) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    this.mensaje = 'Registro exitoso (simulado)';
    
    console.log(form.value);
  }
}