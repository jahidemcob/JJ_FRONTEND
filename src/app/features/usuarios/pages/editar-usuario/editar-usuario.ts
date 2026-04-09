import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-usuario.html',
  styleUrls: ['./editar-usuario.css'],
})
export class EditarUsuario implements OnInit {
  route = inject(ActivatedRoute);
  usuarioService = inject(UsuarioService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  user!: Usuario;               // datos traídos del backend
  nuevaClave: string = '';      // campo temporal para nueva contraseña

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.usuarioService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;       // inicializa usuario con datos existentes
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
      },
    });
  }

  guardar(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // 🔹 Solo agregamos nuevaClave si el usuario escribió algo
    if (this.nuevaClave) {
      (this.user as any).nuevaClave = this.nuevaClave;
    }

    this.usuarioService.updateUser(this.user.idUsuario, this.user).subscribe({
      next: () => {
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        console.error('Error actualizando:', err);
        alert(err?.error?.error || 'Error al actualizar usuario');
      },
    });
  }
}