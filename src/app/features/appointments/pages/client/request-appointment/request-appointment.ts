import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../../../services/services/services.service';
import { Service } from '../../../../services/models/service.model';

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-appointment.html',
  styleUrl: './request-appointment.css',
})
export class RequestAppointment implements OnInit {
  services: Service[] = [];

  constructor(
    private servicesService: ServicesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.servicesService.getActiveServices().subscribe({
      next: (data) => {
        this.services = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando servicios:', err);
      },
    });
  }

  trackById(index: number, item: Service): number {
    return item.idServicio;
  }
}
