import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Servicios
import { PermissionsService } from '../../../services/permissions.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService]
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(
    private messageService: MessageService,
    private router: Router,
    private permsSvc: PermissionsService,
    private usersSvc: UsersService
  ) {}

  login() {
    if (this.email === 'admin@test.com' && this.password === '1234') {
      // 🚀 Setear permisos de admin
      const adminPermissions = [
        'admin',
        'user:ver', 'user:editar', 'user:crear', 'user:eliminar',
        'grupos:ver', 'grupos:agre', 'grupos:eliminar', 'grupos:editar',
        'tickets:ver', 'tickets:agre', 'tickets:eliminar', 'tickets:editar', 'tickets:cambiar_estado',
        'reportes:ver', 'reportes:descargar', 'reportes:crear'
      ];
      this.permsSvc.setPermissions(adminPermissions);
      this.usersSvc.setCurrentUser('1');
      this.router.navigate(['/home']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Credenciales incorrectas'
      });
    }
  }
}

