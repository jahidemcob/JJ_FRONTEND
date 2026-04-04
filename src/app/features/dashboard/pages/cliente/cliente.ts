import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule], // solo lo necesario
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.css'],
})
export class Cliente {
  // aquí agregas tu lógica de dashboard
}