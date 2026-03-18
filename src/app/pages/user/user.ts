import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    Sidebar,
    CommonModule,
    CardModule,
    ButtonModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    TableModule
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

  usuario = {
    usuario: 'juan123',
    email: 'juan@email.com',
    nombreCompleto: 'Juan Pérez',
    direccion: 'Calle Mayor 10',
    telefono: '600123456',
    mayorEdad: true
  };

  editando = false;

  toggleEditar() {
    this.editando = !this.editando;
  }

  /* TICKETS DEL USUARIO */

  tickets = [
    {
      id: 'TK-101',
      titulo: 'Configurar API Login',
      prioridad: 'Alta',
      estado: 'En progreso'
    },
    {
      id: 'TK-106',
      titulo: 'Diseño de Perfil',
      prioridad: 'Media',
      estado: 'Hecho'
    },
    {
      id: 'TK-110',
      titulo: 'Testing de Seguridad',
      prioridad: 'Alta',
      estado: 'Pendiente'
    }
  ];

  get abiertos() {
    return this.tickets.filter(t => t.estado === 'Pendiente').length;
  }

  get progreso() {
    return this.tickets.filter(t => t.estado === 'En progreso').length;
  }

  get hechos() {
    return this.tickets.filter(t => t.estado === 'Hecho').length;
  }

}