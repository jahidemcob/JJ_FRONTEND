import { Routes } from '@angular/router';

// ADMIN
import { ManageAppointments } from './pages/admin/manage-appointments/manage-appointments';

// EMPLOYEE
import { ScheduledAppointments } from './pages/employee/scheduled-appointments/scheduled-appointments';

// CLIENT
import { AppointmentStatus } from './pages/client/appointment-status/appointment-status';
import { RequestAppointment } from './pages/client/request-appointment/request-appointment';
import { App } from '../../app';

// ADMIN ROUTES
export const ADMIN_APPOINTMENTS_ROUTES: Routes = [
  { path: '', component: ManageAppointments },
];

// CLIENT ROUTES
export const CLIENT_APPOINTMENTS_ROUTES: Routes = [ 
  { path: '', component: RequestAppointment },
  { path: 'actualizar/:id', component: AppointmentStatus },
];

// EMPLOYEE ROUTES
export const EMPLOYEE_APPOINTMENTS_ROUTES: Routes = [{ path: '', component: ScheduledAppointments }];

