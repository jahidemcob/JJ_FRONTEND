import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { Service, CreateService } from '../models/service.model';

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

  // POST (crear)
  createService(service: CreateService) {
    return this.httpClient.post<Service>(this.apiUrl, service);
  }

  // PATCH (desactivar)
  disableService(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/${id}/disable`, {});
  }
}
