import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UsuarioFacade } from '../../services/user.facade';
import { UsuarioCreate, BackendErrors } from '../../models/user.model';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-usuario.html',
  styleUrls: ['./crear-usuario.css'],
})
export class CrearUsuario {
  usuario: UsuarioCreate = {
    idRol: 0,
    nombre: '',
    nombreUsuario: '',
    telefono: '',
    correo: '',
    clave: '',
  };

  errores: BackendErrors = {};

  constructor(
    private facade: UsuarioFacade,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  guardar(form: any) {
    this.errores = {};

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.facade.crearUsuario(this.usuario).subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: (err) => {
        this.errores = this.facade.mapBackendErrors(err);
        this.cdr.detectChanges();
      },
    });
  }
}
