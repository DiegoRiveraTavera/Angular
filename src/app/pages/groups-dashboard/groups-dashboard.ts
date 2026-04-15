import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MessageService } from 'primeng/api';
import { TicketsService, Ticket } from '../../services/tickets.service';
import { GroupsService } from '../../services/group.service';
import { UsersService } from '../../services/users.service';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-group-dashboard',
  standalone: true,
  imports: [
    CommonModule, Sidebar, CardModule, TableModule,
    ButtonModule, DialogModule, FormsModule, DragDropModule, ToastModule, TagModule
  ],
  templateUrl: './groups-dashboard.html',
  styleUrls: ['./groups-dashboard.css'],
  providers: [MessageService]
})
export class GroupDashboard implements OnInit {

  grupoId: string = '';
  grupoNombre: string = '';
  tickets: Ticket[] = [];
  integrantes: any[] = [];
  usuariosDisponibles: any[] = []; // para el select del modal

  modalIntegrante = false;
  modalTicket = false;
  nuevoIntegranteId = ''; // ← guardar el ID, no el nombre

  nuevoTicket = {
    title: '',
    description: '',
    status: 'abierto',
    priority: 'media', // ← agregar
    assigned_to: ''
  };

  filtroActivo = 'todos';

  constructor(
    private route: ActivatedRoute,
    private ticketsSvc: TicketsService,
    private groupsSvc: GroupsService,
    private usersSvc: UsersService,
    private messageService: MessageService
  ) {}

 currentUserId: string = '';

ngOnInit() {
  this.grupoId = this.route.snapshot.paramMap.get('nombre') || '';
  this.currentUserId = this.usersSvc.currentUser()?.id || ''; // ← agregar
  this.cargarGrupo();
  this.cargarTickets();
  this.cargarIntegrantes();
  this.cargarUsuariosDisponibles();
}

  cargarGrupo() {
    this.groupsSvc.getById(this.grupoId).subscribe({
      next: (grupo) => this.grupoNombre = grupo.name,
      error: () => this.grupoNombre = 'Grupo'
    });
  }

  cargarTickets() {
    this.ticketsSvc.getByGroup(this.grupoId).subscribe({
      next: (data) => this.tickets = data,
      error: () => this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tickets'
      })
    });
  }

  cargarIntegrantes() {
    this.groupsSvc.getMembers(this.grupoId).subscribe({
      next: (data) => this.integrantes = data,
      error: () => this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los integrantes'
      })
    });
  }

  cargarUsuariosDisponibles() {
    this.usersSvc.getAll().subscribe({
      next: (data) => this.usuariosDisponibles = data,
      error: () => {}
    });
  }

  abrirModalIntegrante() { this.modalIntegrante = true; }

  agregarIntegrante() {
    if (!this.nuevoIntegranteId) return;
    this.groupsSvc.addMember(this.grupoId, this.nuevoIntegranteId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'OK', detail: 'Integrante agregado' });
        this.nuevoIntegranteId = '';
        this.modalIntegrante = false;
        this.cargarIntegrantes(); // recargar lista
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar' })
    });
  }

  eliminarIntegrante(userId: string) {
    this.groupsSvc.removeMember(this.grupoId, userId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'OK', detail: 'Integrante eliminado' });
        this.cargarIntegrantes();
      }
    });
  }

  abrirModalTicket() { this.modalTicket = true; }
  cerrarModalTicket() { this.modalTicket = false; }

  crearTicket() {
    if (!this.nuevoTicket.title.trim()) return;
    const currentUser = this.usersSvc.currentUser();
    this.ticketsSvc.create({
      ...this.nuevoTicket,
      group_id: this.grupoId,
      created_by: currentUser?.id
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Ticket creado' });
        this.nuevoTicket = { title: '', description: '', status: 'abierto', priority: 'media', assigned_to: '' };
        this.modalTicket = false;
        this.cargarTickets();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el ticket' })
    });
  }

  // ─── KANBAN — estados corregidos ──────────────────────────
  // ⚠️ El problema era que el template usaba 'pendiente'/'progreso'/'hecho'
  // pero la BD guarda 'abierto'/'en progreso'/'cerrado'
  drop(event: CdkDragDrop<any[]>, nuevoEstado: string) {
  const ticket: Ticket = event.item.data;
  const currentUser = this.usersSvc.currentUser();

  // ← solo puede mover sus propios tickets
  if (ticket.assigned_to !== currentUser?.id) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Sin permiso',
      detail: 'Solo puedes mover tus propios tickets'
    });
    return;
  }

  if (ticket.status === nuevoEstado) return;

  this.ticketsSvc.updateStatus(ticket.id, nuevoEstado).subscribe({
    next: () => {
      ticket.status = nuevoEstado;
    },
    error: () => this.messageService.add({
      severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado'
    })
  });
}

  // Filtros
  setFiltro(filtro: string) { this.filtroActivo = filtro; }

  get ticketsFiltrados() {
    const currentUser = this.usersSvc.currentUser();
    switch (this.filtroActivo) {
      case 'mis': return this.tickets.filter(t => t.assigned_to === currentUser?.id);
      case 'pendientes': return this.tickets.filter(t => t.status === 'abierto');
      case 'alta': return this.tickets.filter(t => t.priority === 'alta'); // ← corregido
      default: return this.tickets;
    }
  }

  // Resumen
  get totalTickets() { return this.tickets.length; }
  get pendientes() { return this.tickets.filter(t => t.status === 'abierto').length; }
  get progreso() { return this.tickets.filter(t => t.status === 'en_progreso').length; }
  get hechos() { return this.tickets.filter(t => t.status === 'cerrado').length; }
  get bloqueados() { return this.tickets.filter(t => t.status === 'bloqueado').length; }

  // Listas kanban
  get pendientesList() { return this.tickets.filter(t => t.status === 'abierto'); }
  get progresoList() { return this.tickets.filter(t => t.status === 'en_progreso'); }
  get hechosList() { return this.tickets.filter(t => t.status === 'cerrado'); }
  get bloqueadosList() { return this.tickets.filter(t => t.status === 'bloqueado'); }

  getPrioritySeverity(priority: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
  switch (priority) {
    case 'alta': return 'danger';
    case 'media': return 'warn';
    case 'baja': return 'success';
    default: return 'info';
  }
}
}