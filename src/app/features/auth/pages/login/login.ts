import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthFacade, AuthErrors } from '../../../../core/services/auth.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  errores: AuthErrors = {};

  private router = inject(Router);
  private facade = inject(AuthFacade);

  login() {
    const data = {
      username: this.username,
      clave: this.password,
    };

    this.errores = {};

    this.facade.login(data).subscribe({
      next: () => {
        const ruta = this.facade.getRedirectRoute();
        this.router.navigate([`/${ruta}`]);
      },
      error: (err) => {
        this.errores = this.facade.mapLoginErrors(err);
        alert(this.errores.general || this.errores.username);
      },
    });
  }
}
