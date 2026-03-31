import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
  console.log(this.email, this.password);

   if (this.email === 'admin@test.com' && this.password === '123') {
    localStorage.setItem('rol', 'admin');
    this.router.navigate(['/admin']);
 
   } else if (this.email === 'empleado@test.com' && this.password === '123') {
    localStorage.setItem('rol', 'empleado');
    this.router.navigate(['/empleado']);

   } else if (this.email === 'cliente@test.com' && this.password === '123') {
    localStorage.setItem('rol', 'cliente');
    this.router.navigate(['/cliente']);

   } else {
    alert('Credenciales incorrectas');
   }
  }
}