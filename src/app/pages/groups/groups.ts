import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { GroupsService, Group } from '../../services/group.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule, Sidebar, CardModule, TableModule,
    DialogModule, InputTextModule, ButtonModule, FormsModule,
    ToastModule, ConfirmDialogModule, HasPermissionDirective
  ],
  templateUrl: './groups.html',
  styleUrls: ['./groups.css'],
  providers: [MessageService, ConfirmationService]
})
export class Groups implements OnInit {

  grupos: Group[] = [];
  visible = false;
  modoEdicion = false;
  grupoEditandoId: string | null = null;

  nuevoGrupo = {
    name: '',
    level: '',
    author: '',
    description: ''
  };

  constructor(
    private router: Router,
    private groupsSvc: GroupsService,
    private usersSvc: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
  this.cargarGrupos();
}

cargarGrupos() {
  const currentUser = this.usersSvc.currentUser();
  if (!currentUser) return;

  this.groupsSvc.getByUser(currentUser.id).subscribe({
    next: (data) => this.grupos = data,
    error: () => this.messageService.add({
      severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los grupos'
    })
  });
}

  abrirModal() {
    this.resetFormulario();
    this.visible = true;
  }

  cerrarModal() {
    this.visible = false;
  }

  resetFormulario() {
    this.nuevoGrupo = { name: '', level: '', author: '', description: '' };
    this.modoEdicion = false;
    this.grupoEditandoId = null;
  }

  agregarGrupo() {
    if (!this.nuevoGrupo.name) return;

    if (this.modoEdicion && this.grupoEditandoId) {
      this.groupsSvc.update(this.grupoEditandoId, this.nuevoGrupo).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Grupo actualizado' });
          this.visible = false;
          this.cargarGrupos();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' })
      });
    } else {
      this.groupsSvc.create(this.nuevoGrupo).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Grupo creado correctamente' });
          this.visible = false;
          this.cargarGrupos();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' })
      });
    }
  }

  editarGrupo(grupo: Group) {
    this.modoEdicion = true;
    this.grupoEditandoId = grupo.id;
    this.nuevoGrupo = {
      name: grupo.name,
      level: grupo.level,
      author: grupo.author,
      description: grupo.description
    };
    this.visible = true;
  }

  eliminarGrupo(grupo: Group) {
    this.confirmationService.confirm({
      message: `¿Deseas eliminar el grupo "${grupo.name}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.groupsSvc.delete(grupo.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Grupo eliminado' });
            this.cargarGrupos();
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' })
        });
      }
    });
  }

  verDashboard(grupo: Group) {
    this.router.navigate(['/groups-dashboard', grupo.id]);
  }
}