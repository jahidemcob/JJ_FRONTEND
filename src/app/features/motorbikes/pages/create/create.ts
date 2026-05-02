import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MotorbikeService } from '../../services/motorbike.service';
import { CreateMotorbike } from '../../models/motorbike.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  motorbike: CreateMotorbike = {
    marca: '',
    modelo: '',
    placa: '',
    cilindraje: 0,
    anio: 0,
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private motorbikeService: MotorbikeService,
    private cdr: ChangeDetectorRef,
  ) {}

  createMotorbike(form: any) {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // NORMALIZAR PLACA
    this.motorbike.placa = (this.motorbike.placa || '').toUpperCase().replace(/\s/g, '');

    this.motorbikeService.CreateMotorbike(this.motorbike).subscribe({
      next: () => {
        this.successMessage = 'Motocicleta creada correctamente';

        form.resetForm();
        this.loading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Error al crear motocicleta';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
