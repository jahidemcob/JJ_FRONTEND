import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateService } from '../../../models/service.model';
import { ServicesFacade, BackendErrors } from '../../../services/service.facade';

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

  errores: BackendErrors = {};
  loading = false;
  successMessage = '';

  private facade = inject(ServicesFacade);
  private cdr = inject(ChangeDetectorRef);

  createService(form: any) {
    if (this.loading) return;

    this.loading = true;
    this.errores = {};
    this.successMessage = '';

    this.facade.crearServicio(this.service).subscribe({
      next: () => {
        this.successMessage = 'Servicio creado correctamente';
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
