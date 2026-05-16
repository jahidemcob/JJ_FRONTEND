import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateMotorbike } from '../../models/motorbike.model';
import { MotorbikeFacade, BackendErrors } from '../../services/motorbike.facade';

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

  errores: BackendErrors = {};
  loading = false;
  successMessage = '';

  private readonly facade = inject(MotorbikeFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  createMotorbike(form: any) {
    if (this.loading) return;

    this.loading = true;
    this.errores = {};
    this.successMessage = '';

    this.motorbike.placa = (this.motorbike.placa || '').toUpperCase().replaceAll(' ', '');
    
    this.facade.crearMotorbike(this.motorbike).subscribe({
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
        this.errores = this.facade.mapBackendErrors(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
