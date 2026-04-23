import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ServicesService } from '../../../services/services.service';
import { CreateService } from '../../../models/service.model';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-service.html',
  styleUrls: ['./create-service.css'],
})
export class CreateServiceComponent {
  service: CreateService = {
    nombreServicio: '',
    descripcion: '',
    precioBase: 0,
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private servicesService: ServicesService,
    private cdr: ChangeDetectorRef,
  ) {}

  createService(form: any) {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
 
    this.servicesService.createService(this.service).subscribe({
      next: () => {
        this.successMessage = 'Servicio creado correctamente';

        // RESET REAL DEL FORM 
        form.resetForm();

        this.loading = false;

        this.cdr.detectChanges();

        // ocultar mensaje después de 3s
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Error al crear servicio';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
