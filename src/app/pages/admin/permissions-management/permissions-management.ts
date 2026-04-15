import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Sidebar } from '../../../components/sidebar/sidebar';


// Servicios y Models
import { UsersService } from '../../../services/users.service';
import { User, AVAILABLE_PERMISSIONS } from '../../../models/user.model';
import { environment } from '../../../../app/enviroments/enviroment';

@Component({
  selector: 'app-permissions-management',
  standalone: true,
  templateUrl: './permissions-management.html',
  styleUrl: './permissions-management.css',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    CheckboxModule,
    BadgeModule,
    TooltipModule,
    Sidebar
  ],
  providers: [MessageService, ConfirmationService]
})
export class PermissionsManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  visibleUserDialog = false;
  visiblePermissionsDialog = false;

  // Formulario nuevo usuario
  newUserForm = {
    name: '',
    email: '',
    active: true
  };

  // Permisos disponibles
  permissionGroups = AVAILABLE_PERMISSIONS;
  selectedPermissions: string[] = [];

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
  this.usersService.getAll().subscribe({
    next: (users) => {
      this.users = users;  // ← asegúrate que esto recibe los permisos
      console.log('usuarios cargados:', users); // ← verifica en consola
    },
    error: () => this.messageService.add({
      severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios'
    })
  });
}

  // ============= USUARIOS =============
  openNewUserDialog() {
    this.newUserForm = {
      name: '',
      email: '',
      active: true
    };
    this.visibleUserDialog = true;
  }

  createUser() {
  if (!this.newUserForm.name || !this.newUserForm.email) {
    this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Nombre y email requeridos' });
    return;
  }

  // Crear usuario vía API — necesita contraseña temporal
  this.usersService.http.post(`${environment.apiUrl}/users/register`, {
    name: this.newUserForm.name,
    email: this.newUserForm.email,
    password: 'Temporal#123',   // contraseña temporal
    active: this.newUserForm.active
  }).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado' });
      this.visibleUserDialog = false;
      this.loadUsers();
    },
    error: (err) => this.messageService.add({
      severity: 'error', summary: 'Error',
      detail: err.error?.message || 'No se pudo crear el usuario'
    })
  });
}

deleteUser(user: User) {
  this.confirmationService.confirm({
    message: `¿Deseas eliminar a ${user.name}?`,
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.usersService.http.delete(`${environment.apiUrl}/users/${user.id}`).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: `Usuario ${user.name} eliminado` });
          this.loadUsers();
        }
      });
    }
  });
}

toggleUserActive(user: User) {
  this.usersService.updateProfile(user.id, { active: !user.active }).subscribe({
    next: () => this.loadUsers()
  });
}

  // ============= PERMISOS =============
  openPermissionsDialog(user: User) {
  this.selectedUser = { ...user };
  this.selectedPermissions = [];

  // Cargar permisos frescos desde la API
  this.usersService.getById(user.id).subscribe({
    next: (freshUser) => {
      this.selectedUser = freshUser;
      this.selectedPermissions = freshUser.permissions ? [...freshUser.permissions] : [];
      console.log('permisos frescos:', this.selectedPermissions);
    }
  });

  this.visiblePermissionsDialog = true;
}

  savePermissions() {
  if (!this.selectedUser) return;

  this.usersService.http.put(
    `${environment.apiUrl}/users/${this.selectedUser.id}/permissions`,
    { permissions: this.selectedPermissions }
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Permisos actualizados' });
      this.visiblePermissionsDialog = false;
      
      // Recargar usuarios y actualizar selectedUser con datos frescos
      this.usersService.getAll().subscribe({
        next: (users) => {
          this.users = users;
          // Actualizar selectedUser con los permisos nuevos
          const updated = users.find(u => u.id === this.selectedUser?.id);
          if (updated) this.selectedUser = updated;
        }
      });
    },
    error: () => this.messageService.add({ 
      severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los permisos' 
    })
  });
}

  togglePermission(permission: string) {
    const index = this.selectedPermissions.indexOf(permission);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permission);
    }
  }

  hasPermission(permission: string): boolean {
    return this.selectedPermissions.includes(permission);
  }

  getPermissionCount(user: User): number {
  return user.permissions?.length || 0;  // ← agrega el ?.
}

  getActiveUserCount(): number {
    return this.users.filter(u => u.active).length;
  }

  // Limpiar todos los permisos
  clearAllPermissions() {
    this.selectedPermissions = [];
  }

  // Seleccionar todos los permisos
  selectAllPermissions() {
    this.selectedPermissions = Object.values(this.permissionGroups).flat();
  }
}
