import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { Service, CreateService, UpdateService } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/services`;

  // GET TODOS
  getAllServices(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(this.apiUrl);
  }

  getServiceById(id: number): Observable<Service> {
    return this.httpClient.get<Service>(`${this.apiUrl}/${id}`);
  }

  // POST (crear)
  createService(service: CreateService) {
    return this.httpClient.post<Service>(this.apiUrl, service);
  }

  // PUT (editar)
  updateService(service: UpdateService) {
    return this.httpClient.put<{ message: string }>(
      `${this.apiUrl}/${service.idServicio}`,
      service,
    );
  }

  // PATCH activar/desactivar
  toggleServiceStatus(id: number) {
    return this.httpClient.patch<{ message: string; status: boolean }>(
      `${this.apiUrl}/${id}/disable`,
      {},
    );
  }

  getActiveServices() { 
    return this.httpClient.get<Service[]>(`${this.apiUrl}?onlyActive=true`);
  }
}
