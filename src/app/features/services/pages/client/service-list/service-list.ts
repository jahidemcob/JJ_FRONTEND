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
  styleUrl: './service-list.css',
})
export class ServiceList implements OnInit {
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
    this.servicesService.getActiveServices().subscribe({
      next: (data) => {
        this.services = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  trackById(index: number, item: Service) {
    return item.idServicio;
  }
}
