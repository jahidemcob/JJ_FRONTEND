import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { Motorbike, CreateMotorbike, UpdateMotorbike } from '../models/motorbike.model';

@Injectable({
  providedIn: 'root',
})
export class MotorbikeService {
  httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/Motorbike`;

  // GET TODOS
  getAllMotorbikes(): Observable<Motorbike[]> {
    return this.httpClient.get<Motorbike[]>(this.apiUrl);
  }

  getMotorbikeById(id: number): Observable<Motorbike> {
    return this.httpClient.get<Motorbike>(`${this.apiUrl}/${id}`);
  }

  // POST (crear)
  CreateMotorbike(motorbike: CreateMotorbike) {
    return this.httpClient.post<Motorbike>(this.apiUrl, motorbike);
  }

  // PUT (editar)
  updateService(service: UpdateMotorbike) {
    return this.httpClient.put<{ message: string }>(`${this.apiUrl}/${service.idMoto}`, service);
  }

  toggleMotorbikeStatus(id: number) {
    return this.httpClient.patch<{ message: string; status: boolean }>(
      `${this.apiUrl}/${id}/disable`,
      {},
    );
  }
}
