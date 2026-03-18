import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-group-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './groups-dashboard.html',
  styleUrls: ['./groups-dashboard.css']
})
export class GroupDashboard {

  grupoNombre: string = '';

  constructor(private route: ActivatedRoute) {
    this.grupoNombre = this.route.snapshot.paramMap.get('nombre') || '';
  }

  /* INTEGRANTES */

  integrantes: string[] = [
    'Juan',
    'Laura',
    'Carlos'
  ];

  modalIntegrante: boolean = false;

  nuevoIntegrante: string = '';

  abrirModalIntegrante() {
    this.modalIntegrante = true;
  }

  agregarIntegrante() {
    if (this.nuevoIntegrante.trim() !== '') {
      this.integrantes.push(this.nuevoIntegrante.trim());
      this.nuevoIntegrante = '';
      this.modalIntegrante = false;
    }
  }

  eliminarIntegrante(index: number) {
    this.integrantes.splice(index, 1);
  }

  /* MODAL CREAR TICKET */

  modalTicket: boolean = false;

  nuevoTicket = {
    titulo: '',
    descripcion: '',
    estado: 'pendiente',
    prioridad: 'Media',
    asignado: ''
  };

  abrirModalTicket() {
    this.modalTicket = true;
  }

  cerrarModalTicket() {
    this.modalTicket = false;
  }

  crearTicket() {

    if (!this.nuevoTicket.titulo.trim()) {
      return;
    }

    this.tickets.push({
      titulo: this.nuevoTicket.titulo,
      estado: this.nuevoTicket.estado,
      prioridad: this.nuevoTicket.prioridad,
      asignado: this.nuevoTicket.asignado || 'Sin asignar',
      fecha: new Date().toISOString().split('T')[0]
    });

    this.nuevoTicket = {
      titulo: '',
      descripcion: '',
      estado: 'pendiente',
      prioridad: 'Media',
      asignado: ''
    };

    this.modalTicket = false;
  }

  /* TICKETS */

  tickets = [
    {
      titulo: 'Error login',
      estado: 'pendiente',
      prioridad: 'Alta',
      asignado: 'Juan',
      fecha: '2026-03-11'
    },
    {
      titulo: 'Bug dashboard',
      estado: 'progreso',
      prioridad: 'Media',
      asignado: 'Laura',
      fecha: '2026-03-10'
    },
    {
      titulo: 'Crear API',
      estado: 'hecho',
      prioridad: 'Alta',
      asignado: 'Carlos',
      fecha: '2026-03-09'
    },
    {
      titulo: 'Error reporte',
      estado: 'bloqueado',
      prioridad: 'Baja',
      asignado: 'Ana',
      fecha: '2026-03-08'
    },
    {
      titulo: 'Problema CSS',
      estado: 'pendiente',
      prioridad: 'Media',
      asignado: 'Mario',
      fecha: '2026-03-07'
    }
  ];

  /* FILTROS */

  filtroActivo: string = 'todos';
  usuarioActual: string = 'Juan';

  setFiltro(filtro: string) {
    this.filtroActivo = filtro;
  }

  get ticketsFiltrados() {

    switch (this.filtroActivo) {

      case 'mis':
        return this.tickets.filter(t => t.asignado === this.usuarioActual);

      case 'pendientes':
        return this.tickets.filter(t => t.estado === 'pendiente');

      case 'alta':
        return this.tickets.filter(t => t.prioridad === 'Alta');

      default:
        return this.tickets;

    }

  }

  /* RESUMEN */

  get totalTickets() {
    return this.tickets.length;
  }

  get pendientes() {
    return this.tickets.filter(t => t.estado === 'pendiente').length;
  }

  get progreso() {
    return this.tickets.filter(t => t.estado === 'progreso').length;
  }

  get hechos() {
    return this.tickets.filter(t => t.estado === 'hecho').length;
  }

  get bloqueados() {
    return this.tickets.filter(t => t.estado === 'bloqueado').length;
  }

  /* LISTAS KANBAN */

  get pendientesList() {
    return this.tickets.filter(t => t.estado === 'pendiente');
  }

  get progresoList() {
    return this.tickets.filter(t => t.estado === 'progreso');
  }

  get hechosList() {
    return this.tickets.filter(t => t.estado === 'hecho');
  }

  get bloqueadosList() {
    return this.tickets.filter(t => t.estado === 'bloqueado');
  }

  
drop(event: CdkDragDrop<any[]>, nuevoEstado: string) { const ticket = event.item.data; ticket.estado = nuevoEstado; 
}
}