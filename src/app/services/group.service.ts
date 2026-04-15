import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

export interface Group {
  id: string;
  name: string;
  level: string;
  author: string;
  description: string;
  members_count: number;
  tickets_count: number;
}

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private api = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Group[]> {
    return this.http.get<Group[]>(this.api);
  }

  getById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.api}/${id}`);
  }

  create(group: Partial<Group>): Observable<Group> {
    return this.http.post<Group>(this.api, group);
  }

  update(id: string, group: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${this.api}/${id}`, group);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  getMembers(groupId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/${groupId}/members`);
}

addMember(groupId: string, userId: string): Observable<any> {
  return this.http.post(`${this.api}/${groupId}/members`, { user_id: userId });
}

removeMember(groupId: string, userId: string): Observable<any> {
  return this.http.delete(`${this.api}/${groupId}/members/${userId}`);
}

getByUser(userId: string): Observable<Group[]> {
  return this.http.get<Group[]>(`${this.api}/user/${userId}`);
}

}