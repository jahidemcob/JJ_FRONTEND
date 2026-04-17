import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { Usuario, UsuarioCreate, UsuarioUpdate } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/users`;

  // GET TODOS
  GetAllUsers(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // POST (crear)
  registerUser(user: UsuarioCreate): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.apiUrl, user);
  }

  // PUT (actualizar)
  updateUser(id: number, user: UsuarioUpdate): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.apiUrl}/${id}`, user);
  }

  // PATCH (activar/desactivar)
  updateUserStatus(id: number, status: boolean): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/${id}/disable`, { activo: status });
  }
}
