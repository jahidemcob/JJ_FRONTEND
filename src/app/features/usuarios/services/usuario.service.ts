// usuario.service.ts
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarios: Usuario[] = [
    {
      idUsuario: 1,
      idRol: 1,
      nombre: 'Admin',
      usuario: 'admin',
      telefono: '123456789',
      correo: 'admin@test.com',
      activo: true
    }
  ];

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  agregar(usuario: Usuario) {
    this.usuarios.push(usuario);
  }

  actualizar(usuario: Usuario) {
    const index = this.usuarios.findIndex(u => u.idUsuario === usuario.idUsuario);
    if (index !== -1) this.usuarios[index] = usuario;
  }

  cambiarEstado(id: number) {
    const user = this.usuarios.find(u => u.idUsuario === id);
    if (user) user.activo = !user.activo;
  }

  getUsuarioById(id: number): Usuario | undefined {
  return this.usuarios.find(u => u.idUsuario === id);
}
}