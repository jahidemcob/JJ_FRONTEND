import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UpdateService } from '../../../models/service.model';
import { ServicesFacade, BackendErrors } from '../../../services/service.facade';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-service.html',
  styleUrls: ['./edit-service.css'],
})
export class EditService implements OnInit {
  service: UpdateService = {
    idServicio: 0,
    nombreServicio: '',
    descripcion: '',
    precioBase: 0,
  };

  errores: BackendErrors = {};
  loading = false;

  private readonly facade = inject(ServicesFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadService(id);
  }

  loadService(id: number) {
    this.facade.getServicioById(id).subscribe({
      next: (found) => {
        this.service = {
          idServicio: found.idServicio,
          nombreServicio: found.nombreServicio,
          descripcion: found.descripcion,
          precioBase: found.precioBase,
        };
        this.cdr.detectChanges();
      },
      error: () => {
        this.errores.general = 'Servicio no encontrado';
        this.cdr.detectChanges();
      },
    });
  }

  updateService() {
    if (this.loading) return;

    this.loading = true;
    this.errores = {};

    this.facade.actualizarServicio(this.service).subscribe({
      next: () => {
        this.router.navigate(['/admin/servicios']);
      },
      error: (err) => {
        this.errores = this.facade.mapBackendErrors(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
