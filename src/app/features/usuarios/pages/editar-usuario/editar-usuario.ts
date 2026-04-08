import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-usuario.html',
  styleUrls: ['./editar-usuario.css']
})
export class EditarUsuario {

  usuario: any = {
    idUsuario: 0,
    idRol: 1,
    nombre: '',
    usuario: '',
    telefono: '',
    correo: '',
    clave: '',
    activo: true
  };

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const data = this.usuarioService.getUsuarios().find(u => u.idUsuario === id);
    if (data) {
      this.usuario = { ...data }; // copia segura
    }
  }

  guardar() {
    this.usuarioService.actualizar(this.usuario);
    this.router.navigate(['/admin/usuarios']);
  }
}