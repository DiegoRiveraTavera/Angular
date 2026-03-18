// src/app/app.component.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { PermissionsService } from './services/permissions.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, HasPermissionDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private permsSvc: PermissionsService) {
  const jwtPerms = [
    //user
    //grupos
    'grupos:ver', 'grupos:sss', 'grupos:eliminar', 'grupos:editar',
    //tickets
    'tickets:ver'
  ];
  this.permsSvc.setPermissions(jwtPerms);
}


  protected readonly title = signal('ERP');
}
