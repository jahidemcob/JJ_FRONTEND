import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MotorbikeService } from '../../services/motorbike.service';
import { UpdateMotorbike } from '../../models/motorbike.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  motorbike: UpdateMotorbike = {
    idMoto: 0,
    marca: '',
    modelo: '',
    cilindraje: 0,
    anio: 0,
  };

  loading = false;
  errorMessage = '';

  constructor(
    private motorbikeService: MotorbikeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadMotorbike(id);
    }
  }

  loadMotorbike(id: number) {
    this.motorbikeService.getMotorbikeById(id).subscribe({
      next: (found) => {
        this.motorbike = {
          idMoto: found.idMoto,
          marca: found.marca,
          modelo: found.modelo,
          cilindraje: found.cilindraje,
          anio: found.anio,
        };

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Motocicleta no encontrada';
        this.cdr.detectChanges();
      },
    });
  }

  updateService() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this.motorbikeService.updateService(this.motorbike).subscribe({
      next: () => {
        this.router.navigate(['/cliente/motocicletas']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Error al actualizar motocicleta';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
