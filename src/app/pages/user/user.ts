import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../services/users.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../app/enviroments/enviroment';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    Sidebar, CommonModule, CardModule, ButtonModule,
    FormsModule, CheckboxModule, InputTextModule, TableModule, ToastModule
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
  providers: [MessageService]
})
export class User implements OnInit {

  // Datos del perfil mapeados a tu BD
  usuario = {
    name: '',
    email: '',
    calle: '',
    colonia: '',
    no_exterior: '',
    telefono: '',
    active: true
  };

  editando = false;
  tickets: any[] = [];
  private userId = '';

  constructor(
    private usersSvc: UsersService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const currentUser = this.usersSvc.currentUser();
    if (!currentUser) return;

    this.userId = currentUser.id;
    this.usuario = {
      name: currentUser.name || '',
      email: currentUser.email || '',
      calle: currentUser.calle || '',
      colonia: currentUser.colonia || '',
      no_exterior: currentUser.no_exterior || '',
      telefono: currentUser.telefono || '',
      active: currentUser.active ?? true
    };

    this.cargarTickets();
  }

  cargarTickets() {
    this.http.get<any[]>(`${environment.apiUrl}/tickets`).subscribe({
      next: (tickets) => {
        // Filtrar solo los tickets asignados al usuario actual
        this.tickets = tickets.filter(t =>
          t.assigned_to === this.userId || t.created_by === this.userId
        );
      },
      error: () => {
        // Si la API de tickets aún no está conectada, dejar vacío
        this.tickets = [];
      }
    });
  }

  toggleEditar() {
    if (this.editando) {
      this.guardarPerfil();
    } else {
      this.editando = true;
    }
  }

  guardarPerfil() {
    this.http.put(`${environment.apiUrl}/users/${this.userId}`, this.usuario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Perfil actualizado correctamente'
        });
        this.editando = false;
      },
      error: () => {
        // Si el endpoint PUT aún no existe, solo cerramos edición
        this.editando = false;
      }
    });
  }

  get abiertos() {
    return this.tickets.filter(t => t.status === 'abierto').length;
  }

  get progreso() {
    return this.tickets.filter(t => t.status === 'en progreso').length;
  }

  get hechos() {
    return this.tickets.filter(t => t.status === 'cerrado').length;
  }
}