import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../../services/users.service';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'], 
  imports: [FormsModule, ButtonModule, InputTextModule, PasswordModule, CardModule, ToastModule, RouterModule],
  providers: [MessageService]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private usersSvc: UsersService,
    private permsSvc: PermissionsService
  ) {}

  login() {
  if (!this.email || !this.password) return;
  this.loading = true;

  this.usersSvc.login(this.email, this.password).subscribe({
    // login.ts — en el next:
next: (res) => {
  // Los permisos ya vienen en res.user.permissions desde la BD
  this.permsSvc.setPermissions(res.user.permissions || []);
  this.router.navigate(['/home']);
},
    error: (err) => {
      this.loading = false;
      const msg = err.status === 401 ? 'Credenciales incorrectas' : 'Error al conectar';
      this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
  });
}
}