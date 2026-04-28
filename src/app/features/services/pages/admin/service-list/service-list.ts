import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicesService } from '../../../services/services.service';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-list.html',
  styleUrls: ['./service-list.css'],
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];

  constructor(
    private servicesService: ServicesService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices() {
    this.servicesService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;

        console.log('Servicios:', data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando servicios:', err);
      },
    });
  }

  trackById(index: number, item: Service) {
    return item.idServicio;
  }
 
  goToCreate() {
    this.router.navigate(['/admin/servicios/crear']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/admin/servicios/editar', id]);
  }

  toggleStatus(service: Service) {
    this.servicesService.toggleServiceStatus(service.idServicio).subscribe({
      next: (res) => {
        // actualizamos el estado local sin recargar todo
        service.isActive = res.status;

        console.log(res.message);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cambiando estado:', err);
      },
    });
  }
}
