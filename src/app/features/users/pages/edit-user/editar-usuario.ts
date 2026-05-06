import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsuarioFacade } from '../../services/user.facade';
import { Usuario, UsuarioUpdate, BackendErrors } from '../../models/user.model';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-usuario.html',
  styleUrls: ['./editar-usuario.css'],
})
export class EditarUsuario implements OnInit {
  private route = inject(ActivatedRoute);
  private facade = inject(UsuarioFacade);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  user!: Usuario;
  nuevaClave = '';

  errores: BackendErrors = {};

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.facade.getUsuario(id).subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  guardar(form: any) {
    this.errores = {};

    // validar form
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // validar user
    if (!this.user || !this.user.idUsuario) {
      return;
    }

    // validar contraseña corta
    if (this.nuevaClave && this.nuevaClave.length < 6) {
      form.control?.markAllAsTouched?.();
      return;
    }

    const updateData: UsuarioUpdate = {
      ...this.user,
      ...(this.nuevaClave ? { nuevaClave: this.nuevaClave } : {}),
    };

    this.facade.actualizarUsuario(this.user.idUsuario, updateData).subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: (err) => {
        this.errores = this.facade.mapBackendErrors(err);
        this.cdr.detectChanges();
      },
    });
  }
}
