// src/app/app.component.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { PermissionsService } from './services/permissions.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, HasPermissionDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    private permsSvc: PermissionsService,
    private usersSvc: UsersService
  ) {
    // Permisos del Admin (usuario actual)
    const jwtPerms = [
      // admin
      'admin',
      // user
      'user:ver', 'user:editar',
      // grupos
      'grupos:ver', 'grupos:agre', 'grupos:eliminar', 'grupos:editar',
      // tickets
      'tickets:ver'
    ];
    this.permsSvc.setPermissions(jwtPerms);
  }

  protected readonly title = signal('ERP');
}
