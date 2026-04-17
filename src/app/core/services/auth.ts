import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
  rol?: string;
  exp: number;
}

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
        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        localStorage.setItem('usuario', JSON.stringify(response));
      }),
    );
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Decodificar token
  getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  // Obtener rol desde JWT
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role?.toLowerCase() || decoded?.rol?.toLowerCase() || null;
  }

  // Obtener ruta según rol
  getRedirectRoute(): string {
    const rol = this.getUserRole();

    const roleMap: any = {
      administrador: 'admin',
      empleado: 'empleado',
      cliente: 'cliente',
    };

    return roleMap[rol || 'cliente'] || 'cliente';
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded?.exp) return false;

    return decoded.exp * 1000 > Date.now();
  }

  // 📝 REGISTRO
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // 🚪 LOGOUT
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
