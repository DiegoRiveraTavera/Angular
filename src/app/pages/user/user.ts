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
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../services/users.service';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    Sidebar, CommonModule, CardModule, ButtonModule,
    FormsModule, CheckboxModule, InputTextModule,
    TableModule, ToastModule, TagModule
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
  providers: [MessageService]
})
export class User implements OnInit {

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
    private ticketsSvc: TicketsService,
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
    this.ticketsSvc.getByUser(this.userId).subscribe({
      next: (data) => this.tickets = data,
      error: () => this.tickets = []
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
    this.usersSvc.updateProfile(this.userId, this.usuario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success', summary: 'Guardado', detail: 'Perfil actualizado'
        });
        this.editando = false;
      },
      error: () => { this.editando = false; }
    });
  }

  // ─── Helpers de prioridad ─────────────────────────────────
  getPrioritySeverity(priority: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    switch (priority) {
      case 'alta': return 'danger';
      case 'media': return 'warn';
      case 'baja': return 'success';
      default: return 'info';
    }
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    switch (status) {
      case 'abierto': return 'info';
      case 'en_progreso': return 'warn';
      case 'cerrado': return 'success';
      case 'bloqueado': return 'danger';
      default: return 'secondary';
    }
  }

  // ─── Resumen ──────────────────────────────────────────────
  get abiertos() { return this.tickets.filter(t => t.status === 'abierto').length; }
  get progreso() { return this.tickets.filter(t => t.status === 'en_progreso').length; }
  get hechos() { return this.tickets.filter(t => t.status === 'cerrado').length; }
}