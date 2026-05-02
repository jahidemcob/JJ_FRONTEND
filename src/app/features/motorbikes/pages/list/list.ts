import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MotorbikeService } from '../../services/motorbike.service';
import { Motorbike } from '../../models/motorbike.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class MotorbikeListComponent implements OnInit {
  motorbikes: Motorbike[] = [];

  constructor(
    private MotorbikeService: MotorbikeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadMotorbikes();
  }

  loadMotorbikes() {
    this.MotorbikeService.getAllMotorbikes().subscribe({
      next: (data) => {
        this.motorbikes = data;

        console.log('Motocicletas:', data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando motocicletas:', err);
      },
    });
  }

  trackById(index: number, item: Motorbike) {
    return item.idMoto;
  }

  goToCreate() {
    this.router.navigate(['/cliente/motocicletas/crear']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/cliente/motocicletas/editar', id]);
  }

  toggleStatus(motorbike: Motorbike) {
    this.MotorbikeService.toggleMotorbikeStatus(motorbike.idMoto).subscribe({
      next: (res) => {
        motorbike.activo = res.status;

        console.log(res.message);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cambiando estado:', err);
      },
    });
  }
}
