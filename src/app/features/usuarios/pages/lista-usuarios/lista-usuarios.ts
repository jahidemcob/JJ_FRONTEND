import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrls: ['./lista-usuarios.css']
})
export class ListaUsuarios implements OnInit {

  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  irCrear() {
    this.router.navigate(['/admin/usuarios/crear']);
  }

  irEditar(id: number) {
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  cambiarEstado(id: number) {
    this.usuarioService.cambiarEstado(id);
    this.usuarios = this.usuarioService.getUsuarios();
  }
}