import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_by: string;
  assigned_to: string;
  assigned_to_name?: string;
  created_by_name?: string;
  group_id: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private api = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.api);
  }

  getByGroup(groupId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.api}/group/${groupId}`);
  }

  // ✅ tickets donde el usuario es creador o asignado
  getByUser(userId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.api}/user/${userId}`);
  }

  getById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.api}/${id}`);
  }

  create(ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.post<Ticket>(this.api, ticket);
  }

  update(id: string, ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.api}/${id}`, ticket);
  }

  updateStatus(id: string, status: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.api}/${id}/status`, { status });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}