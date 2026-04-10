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
  loadingIds: number[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.GetAllUsers().subscribe({
      next: (users) => {
        this.usuarios = users;

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

    user.activo = nuevoEstado;

    this.usuarioService.updateUserStatus(id, nuevoEstado).subscribe({
      next: () => {
        this.loadingIds = this.loadingIds.filter((i) => i !== id);
      },
      error: (err) => {
        console.error('Error actualizando estado:', err);

        user.activo = !nuevoEstado;

        this.loadingIds = this.loadingIds.filter((i) => i !== id);
      },
    });
  }

  trackById(index: number, item: Usuario) {
    return item.idUsuario;
  }
}
