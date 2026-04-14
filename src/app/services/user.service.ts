import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../app/enviroments/enviroment'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:4000/users'

  constructor(private http: HttpClient) {}

  // GET TODOS
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl)
  }

  // GET POR ID
  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`)
  }

  // CREAR
  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user)
  }

  // EDITAR
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user)
  }

  // ELIMINAR
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
  
  //login
  login(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, data)
}
}