import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({ 
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  // LOGIN
  login(data: { username: string; clave: string }) {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        console.log('RESPUESTA BACKEND:', response);

        // Guardar token
        localStorage.setItem('token', response.token);

        // Guardar usuario 
        localStorage.setItem('usuario', JSON.stringify(response));
      }),
    );
  }

  // Decodificar token
  getDecodedToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  // Obtener rol desde JWT
  getUserRole(): string | null {
    const decoded: any = this.getDecodedToken();

    return decoded?.role?.toLowerCase() || decoded?.rol?.toLowerCase() || null;
  }

  // Verificar sesión válida
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded: any = this.getDecodedToken();

    if (!decoded?.exp) return false;

    return decoded.exp * 1000 > Date.now();
  }

  // REGISTRO
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  //cerrar sesion
  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}
