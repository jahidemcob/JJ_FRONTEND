import { Component, inject, NgZone, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthFacade, AuthErrors } from '../../../../core/services/auth.facade';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errores: AuthErrors = {};

  private readonly router = inject(Router);
  private readonly facade = inject(AuthFacade);
  private readonly ngZone = inject(NgZone);

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: '542870968155-on5ppmqcj0j6ofmp1f1vnpvk87hdc2jh.apps.googleusercontent.com',
      use_fedcm_for_prompt: false,
      callback: (response: any) => {
        this.ngZone.run(() => {
          this.facade.loginWithGoogle(response.credential).subscribe({
            next: (res: any) => {
              if (res.perfilCompleto === false) {
                this.router.navigate(['/complete-profile']);
              } else {
                const ruta = this.facade.getRedirectRoute();
                this.router.navigate([`/${ruta}`]);
              }
            },
            error: (err: any) => {
              this.errores = this.facade.mapLoginErrors(err);
              alert(this.errores.general);
            },
          });
        });
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-signin-btn'), {
      theme: 'outline',
      size: 'large',
      width: 330,
      text: 'continue_with',
      locale: 'es',
    });
  }

  login() {
    const data = { username: this.username, clave: this.password };
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
