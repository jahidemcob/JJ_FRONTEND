import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrls: ['./lista-usuarios.css'],
})
export class ListaUsuarios implements OnInit {
  usuarios: Usuario[] = [];

  // 🔥 control de clicks
  loadingIds: number[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef, // 🔥 clave
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsers().subscribe({
      next: (users) => {
        this.usuarios = users;

        // 🔥 forzar actualización de vista
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
      },
    });
  }

  registerUser() {
    this.router.navigate(['/admin/usuarios/crear']);
  }

  updateUser(id: number) {
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  updateUserStatus(id: number) {
    if (this.loadingIds.includes(id)) return;

    const user = this.usuarios.find((u) => u.idUsuario === id);
    if (!user) return;

    const nuevoEstado = !user.activo;

    // 🔥 actualización inmediata UI
    user.activo = nuevoEstado;

    this.usuarioService.updateUserStatus(id, nuevoEstado).subscribe({
      next: () => {
        // 🔥 desbloquear botón
        this.loadingIds = this.loadingIds.filter((i) => i !== id);
      },
      error: (err) => {
        console.error('Error actualizando estado:', err);

        // 🔥 revertir si falla
        user.activo = !nuevoEstado;

        this.loadingIds = this.loadingIds.filter((i) => i !== id);
      },
    });
  }

  // 🔥 mejora rendimiento de tabla
  trackById(index: number, item: Usuario) {
    return item.idUsuario;
  }
}
