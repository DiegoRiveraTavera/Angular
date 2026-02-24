import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ToastModule
  ],
  providers: [MessageService]
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  login() {
    if (this.email === 'admin@test.com' && this.password === '1234') {
      this.messageService.add({
        severity: 'success',
        summary: 'Login correcto',
        detail: 'Bienvenido'
      });

      this.router.navigate(['/dashboard']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Credenciales incorrectas'
      });
    }
  }
}