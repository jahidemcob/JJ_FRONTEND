// usuario.model.ts
export interface Usuario {
  idUsuario: number;
  idRol: number;
  nombre: string;
  usuario: string;
  telefono?: string;
  correo?: string;
  activo: boolean;
}