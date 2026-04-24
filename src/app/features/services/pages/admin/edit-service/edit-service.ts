import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ServicesService } from '../../../services/services.service';
import { UpdateService } from '../../../models/service.model';

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

  loading = false;
  errorMessage = '';

  constructor(
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadService(id);
    }
  }

  // CARGAR SERVICIO
  loadService(id: number) {
    this.servicesService.getAllServices().subscribe({
      next: (services) => {
        const found = services.find((s) => s.idServicio === id);

        if (!found) {
          this.errorMessage = 'Servicio no encontrado';
          return;
        }

        this.service = {
          idServicio: found.idServicio,
          nombreServicio: found.nombreServicio,
          descripcion: found.descripcion,
          precioBase: found.precioBase,
        };

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error cargando servicio';
      },
    });
  }

  // ACTUALIZAR Y REDIRIGIR
  updateService() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this.servicesService.updateService(this.service).subscribe({
      next: () => {
        // 🚀 redirección inmediata
        this.router.navigate(['/admin/servicios']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Error al actualizar servicio';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
