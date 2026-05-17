import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppointmentFacade } from '../../../services/appointment.facade';
import { MotorbikeFacade } from '../../../../motorbikes/services/motorbike.facade';
import { ServicesFacade } from '../../../../services/services/service.facade';

import {
  AppointmentSummary,
  Appointment,
  AppointmentState,
} from '../../../models/appointment.model';
import { Motorbike } from '../../../../motorbikes/models/motorbike.model';
import { Service } from '../../../../services/models/service.model';

@Component({
  selector: 'app-scheduled-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduled-appointments.html',
  styleUrl: './scheduled-appointments.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduledAppointmentsComponent implements OnInit {
  appointments: AppointmentSummary[] = [];
  motorbikesMap: Map<number, Motorbike> = new Map();
  services: Service[] = [];
  loadingIds: number[] = [];

  private readonly appointmentCache: Map<number, Appointment> = new Map();

  filtroEstado: AppointmentState | 'Todas' = 'Todas';
  filtroFecha: string = '';

  estados: (AppointmentState | 'Todas')[] = ['Todas', 'Agendada', 'EnProceso', 'Completada'];

  selectedAppointment: Appointment | null = null;
  loadingDetail = false;

  private readonly facade = inject(AppointmentFacade);
  private readonly motorbikeFacade = inject(MotorbikeFacade);
  private readonly servicesFacade = inject(ServicesFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.servicesFacade.getServicios().subscribe({
      next: (data) => {
        this.services = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });

    this.loadAppointments();
  }

  loadAppointments(): void {
    this.facade.getByEmployee().subscribe({
      next: (data) => {
        this.appointments = data;

        const idsNuevos = [...new Set(data.map((a) => a.idMoto))].filter(
          (id) => id && !this.motorbikesMap.has(id),
        );

        if (idsNuevos.length > 0) {
          forkJoin(
            idsNuevos.map((id) =>
              this.motorbikeFacade.getMotorbikeById(id).pipe(catchError(() => of(null))),
            ),
          ).subscribe((motos) => {
            motos.forEach((m) => {
              if (m) {
                this.motorbikesMap.set(m.idMoto, m);
              }
            });

            this.cdr.markForCheck();
          });
        } else {
          this.cdr.markForCheck();
        }
      },
      error: (err) => console.error(err),
    });
  }

  get appointmentsFiltradas(): AppointmentSummary[] {
    return this.appointments.filter((a) => {
      const estadoOk = this.filtroEstado === 'Todas' || a.estadoCita === this.filtroEstado;

      const fechaOk = !this.filtroFecha || a.fechaCita === this.filtroFecha;

      return estadoOk && fechaOk;
    });
  }

  cambiarFiltro(estado: AppointmentState | 'Todas'): void {
    this.filtroEstado = estado;

    if (this.selectedAppointment) {
      this.closeDetail();
    }

    this.cdr.markForCheck();
  }

  limpiarFecha(): void {
    this.filtroFecha = '';
    this.cdr.markForCheck();
  }

  openDetail(idPedido: number): void {
    // cerrar si ya está abierto
    if (this.selectedAppointment?.idPedido === idPedido) {
      this.closeDetail();
      return;
    }

    // mostrar panel inmediatamente
    this.loadingDetail = true;
    this.selectedAppointment = null;

    // fuerza render inmediato
    this.cdr.detectChanges();

    // cache
    if (this.appointmentCache.has(idPedido)) {
      this.selectedAppointment = this.appointmentCache.get(idPedido)!;

      this.loadingDetail = false;

      this.cdr.detectChanges();
      return;
    }

    // request
    this.facade.getById(idPedido).subscribe({
      next: (data) => {
        this.selectedAppointment = data;

        this.appointmentCache.set(idPedido, data);

        this.loadingDetail = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);

        this.loadingDetail = false;

        this.cdr.detectChanges();
      },
    });
  }

  closeDetail(): void {
    this.selectedAppointment = null;
    this.loadingDetail = false;

    this.cdr.detectChanges();
  }

  enDesarrollo(idPedido: number): void {
    if (this.loadingIds.includes(idPedido)) return;

    // optimistic update
    this.appointments = this.appointments.map((app) =>
      app.idPedido === idPedido
        ? {
            ...app,
            estadoCita: 'EnProceso' as AppointmentState,
          }
        : app,
    );

    if (this.selectedAppointment?.idPedido === idPedido) {
      this.selectedAppointment = {
        ...this.selectedAppointment,
        estadoCita: 'EnProceso',
      };
    }

    this.loadingIds.push(idPedido);

    this.cdr.markForCheck();

    this.facade.updateState(idPedido, 'EnProceso').subscribe({
      next: (updatedAppointment) => {
        this.appointmentCache.set(idPedido, updatedAppointment);

        this.appointments = this.appointments.map((app) =>
          app.idPedido === idPedido
            ? {
                ...app,
                estadoCita: updatedAppointment.estadoCita,
              }
            : app,
        );

        if (this.selectedAppointment?.idPedido === idPedido) {
          this.selectedAppointment = updatedAppointment;
        }

        this.loadingIds = this.loadingIds.filter((i) => i !== idPedido);

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);

        this.appointments = this.appointments.map((app) =>
          app.idPedido === idPedido
            ? {
                ...app,
                estadoCita: 'Agendada' as AppointmentState,
              }
            : app,
        );

        this.loadingIds = this.loadingIds.filter((i) => i !== idPedido);

        this.cdr.markForCheck();
      },
    });
  }

  terminado(idPedido: number): void {
    if (this.loadingIds.includes(idPedido)) return;

    const estadoAnterior = this.appointments.find((a) => a.idPedido === idPedido)?.estadoCita;

    // optimistic update
    this.appointments = this.appointments.map((app) =>
      app.idPedido === idPedido
        ? {
            ...app,
            estadoCita: 'Completada' as AppointmentState,
          }
        : app,
    );

    if (this.selectedAppointment?.idPedido === idPedido) {
      this.selectedAppointment = {
        ...this.selectedAppointment,
        estadoCita: 'Completada',
      };
    }

    this.loadingIds.push(idPedido);

    this.cdr.markForCheck();

    this.facade.updateState(idPedido, 'Completada').subscribe({
      next: (updatedAppointment) => {
        this.appointmentCache.set(idPedido, updatedAppointment);

        this.appointments = this.appointments.map((app) =>
          app.idPedido === idPedido
            ? {
                ...app,
                estadoCita: updatedAppointment.estadoCita,
              }
            : app,
        );

        if (this.selectedAppointment?.idPedido === idPedido) {
          this.selectedAppointment = updatedAppointment;
        }

        this.loadingIds = this.loadingIds.filter((i) => i !== idPedido);

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);

        this.appointments = this.appointments.map((app) =>
          app.idPedido === idPedido
            ? {
                ...app,
                estadoCita: estadoAnterior ?? ('EnProceso' as AppointmentState),
              }
            : app,
        );

        this.loadingIds = this.loadingIds.filter((i) => i !== idPedido);

        this.cdr.markForCheck();
      },
    });
  }

  getNombreMoto(idMoto: number): string {
    const moto = this.motorbikesMap.get(idMoto);

    return moto ? `${moto.marca} ${moto.modelo}` : '—';
  }

  getNombreServicio(idServicio: number): string {
    const s = this.services.find((s) => s.idServicio === idServicio);

    return s ? s.nombreServicio : `Servicio #${idServicio}`;
  }

  getLabelEstado(estado: AppointmentState | 'Todas'): string {
    return estado === 'EnProceso' ? 'En Proceso' : estado;
  }

  getIndiceCita(idPedido: number): number {
    return this.appointmentsFiltradas.findIndex((a) => a.idPedido === idPedido) + 1;
  }

  isLoading(id: number): boolean {
    return this.loadingIds.includes(id);
  }

  trackById(_: number, item: AppointmentSummary): number {
    return item.idPedido;
  }
}
