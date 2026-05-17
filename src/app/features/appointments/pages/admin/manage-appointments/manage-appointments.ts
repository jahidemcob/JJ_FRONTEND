import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppointmentFacade } from '../../../services/appointment.facade';
import { UsuarioFacade } from '../../../../users/services/user.facade';
import { MotorbikeFacade } from '../../../../motorbikes/services/motorbike.facade';
import { ServicesFacade } from '../../../../services/services/service.facade';

import {
  AppointmentSummary,
  Appointment,
  AppointmentState,
} from '../../../models/appointment.model';
import { Usuario } from '../../../../users/models/user.model';
import { Motorbike } from '../../../../motorbikes/models/motorbike.model';
import { Service } from '../../../../services/models/service.model';

@Component({
  selector: 'app-manage-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-appointments.html',
  styleUrl: './manage-appointments.css',
})
export class ManageAppointmentsComponent implements OnInit {
  appointments: AppointmentSummary[] = [];
  motorbikesMap: Map<number, Motorbike> = new Map();
  services: Service[] = [];
  loadingIds: number[] = [];

  private readonly appointmentCache: Map<number, Appointment> = new Map();

  filtroEstado: AppointmentState | 'Todas' = 'Todas';
  filtroFecha: string = '';
  estados: (AppointmentState | 'Todas')[] = [
    'Todas',
    'Pendiente',
    'Agendada',
    'EnProceso',
    'Completada',
    'Rechazada',
  ];

  selectedAppointment: Appointment | null = null;
  loadingDetail = false;

  assigningId: number | null = null;
  employees: Usuario[] = [];
  loadingEmployees = false;
  selectedEmployeeId: number | null = null;

  private readonly facade = inject(AppointmentFacade);
  private readonly usuarioFacade = inject(UsuarioFacade);
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

  loadAppointments() {
    this.facade.getAll().subscribe({
      next: (data) => {
        this.appointments = data;
        const idsNuevos = [...new Set(data.map((a) => a.idMoto))].filter(
          (id) => !this.motorbikesMap.has(id),
        );
        if (idsNuevos.length > 0) {
          forkJoin(
            idsNuevos.map((id) =>
              this.motorbikeFacade.getMotorbikeById(id).pipe(catchError(() => of(null))),
            ),
          ).subscribe((motos) => {
            motos.forEach((m) => {
              if (m) this.motorbikesMap.set(m.idMoto, m);
            });
            this.cdr.detectChanges();
          });
        } else {
          this.cdr.detectChanges();
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

  cambiarFiltro(estado: AppointmentState | 'Todas') {
    this.filtroEstado = estado;
    if (this.selectedAppointment) this.closeDetail();
    this.cdr.detectChanges();
  }

  limpiarFecha() {
    this.filtroFecha = '';
    this.cdr.detectChanges();
  }

  openDetail(idPedido: number) {
    if (this.selectedAppointment?.idPedido === idPedido) {
      this.closeDetail();
      return;
    }

    if (this.appointmentCache.has(idPedido)) {
      this.selectedAppointment = this.appointmentCache.get(idPedido)!;
      this.loadingDetail = false;
      this.cdr.detectChanges();
      return;
    }

    const summary = this.appointments.find((a) => a.idPedido === idPedido);
    if (summary) {
      this.selectedAppointment = {
        ...summary,
        fechaCreacionCita: '',
        detalles: [],
      } as unknown as Appointment;
    }

    this.loadingDetail = true;
    this.cdr.detectChanges();

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

  closeDetail() {
    this.selectedAppointment = null;
    this.loadingDetail = false;
    this.cdr.detectChanges();
  }

  abrirAsignar(idPedido: number) {
    this.assigningId = idPedido;
    this.selectedEmployeeId = null;
    this.employees = [];
    this.loadingEmployees = true;
    this.cdr.detectChanges();

    this.usuarioFacade.getUsuarios().subscribe({
      next: (users) => {
        this.employees = users.filter((u) => u.idRol === 2 && u.activo);
        this.loadingEmployees = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingEmployees = false;
        this.cdr.detectChanges();
      },
    });
  }

  cerrarAsignar() {
    this.assigningId = null;
    this.selectedEmployeeId = null;
    this.cdr.detectChanges();
  }

  confirmarAsignar() {
    if (!this.assigningId || !this.selectedEmployeeId) return;

    const id = this.assigningId;
    const emp = this.employees.find((e) => e.idUsuario === this.selectedEmployeeId);

    // 1. Optimistic update — cambia la referencia para que Angular detecte el cambio
    this.appointments = this.appointments.map((app) => {
      if (app.idPedido === id) {
        return {
          ...app,
          estadoCita: 'Agendada' as AppointmentState,
          nombreEmpleado: emp ? emp.nombre : app.nombreEmpleado,
        };
      }
      return app;
    });

    // 2. Sincronizar el panel de detalles si está abierto para esta cita
    if (this.selectedAppointment?.idPedido === id) {
      this.selectedAppointment = {
        ...this.selectedAppointment,
        estadoCita: 'Agendada',
        idEmpleado: emp?.idUsuario,
        nombreEmpleado: emp ? emp.nombre : this.selectedAppointment.nombreEmpleado,
      };
    }

    // 3. Bloquear fila y cerrar modal
    this.loadingIds.push(id);
    this.assigningId = null;
    this.cdr.detectChanges();

    // 4. Petición real al servidor
    this.facade.assignEmployee(id, { idUsuario: this.selectedEmployeeId }).subscribe({
      next: (updatedAppointment) => {
        // Guardar respuesta definitiva en caché
        this.appointmentCache.set(id, updatedAppointment);

        // Actualizar la lista localmente con la respuesta del servidor
        // (sin llamar loadAppointments() para evitar sobreescribir con datos stale)
        this.appointments = this.appointments.map((app) =>
          app.idPedido === id
            ? {
                ...app,
                estadoCita: updatedAppointment.estadoCita,
                nombreEmpleado: updatedAppointment.nombreEmpleado,
              }
            : app,
        );

        if (this.selectedAppointment?.idPedido === id) {
          this.selectedAppointment = updatedAppointment;
        }

        this.loadingIds = this.loadingIds.filter((i) => i !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        // Reversión al estado original en caso de error
        this.appointments = this.appointments.map((app) => {
          if (app.idPedido === id) {
            return {
              ...app,
              estadoCita: 'Pendiente' as AppointmentState,
              nombreEmpleado: undefined,
            };
          }
          return app;
        });

        if (this.selectedAppointment?.idPedido === id) {
          this.selectedAppointment = null;
        }

        this.loadingIds = this.loadingIds.filter((i) => i !== id);
        this.cdr.detectChanges();
      },
    });
  }

  rechazar(idPedido: number) {
    if (this.loadingIds.includes(idPedido)) return;

    // Guardar referencia del estado anterior para posible reversión
    const citaOriginal = this.appointments.find((app) => app.idPedido === idPedido);
    const estadoAnterior = citaOriginal?.estadoCita;

    // 1. Optimistic update — cambia la referencia para que Angular detecte el cambio
    this.appointments = this.appointments.map((app) =>
      app.idPedido === idPedido ? { ...app, estadoCita: 'Rechazada' as AppointmentState } : app,
    );

    if (this.selectedAppointment?.idPedido === idPedido) {
      this.selectedAppointment = null;
    }

    this.loadingIds.push(idPedido);
    this.cdr.detectChanges();

    this.facade.updateState(idPedido, 'Rechazada').subscribe({
      next: (updatedAppointment) => {
        // Guardar respuesta definitiva en caché
        this.appointmentCache.set(idPedido, updatedAppointment);

        // Actualizar la lista localmente con la respuesta del servidor
        // (sin llamar loadAppointments() para evitar sobreescribir con datos stale)
        this.appointments = this.appointments.map((app) =>
          app.idPedido === idPedido ? { ...app, estadoCita: updatedAppointment.estadoCita } : app,
        );

        this.loadingIds = this.loadingIds.filter((i) => i !== idPedido);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        // Reversión al estado anterior en caso de error
        this.appointments = this.appointments.map((app) =>
          app.idPedido === idPedido
            ? { ...app, estadoCita: estadoAnterior ?? ('Pendiente' as AppointmentState) }
            : app,
        );

        this.loadingIds = this.loadingIds.filter((i) => i !== idPedido);
        this.cdr.detectChanges();
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

  isLoading(id: number): boolean {
    return this.loadingIds.includes(id);
  }

  trackById(_: number, item: AppointmentSummary) {
    return item.idPedido;
  }
}
