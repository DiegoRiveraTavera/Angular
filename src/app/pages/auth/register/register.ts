import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../app/enviroments/enviroment';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    ButtonModule, InputTextModule, PasswordModule,
    CardModule, CheckboxModule, ToastModule
  ],
  providers: [MessageService]
})
export class RegisterComponent {

  loading = false;

  registerForm;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        calle: ['', Validators.required],
        colonia: ['', Validators.required],
        no_exterior: [''],
        telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/.*#.*/)
        ]],
        confirmPassword: ['', Validators.required],
        mayorEdad: [false, Validators.requiredTrue]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(form: AbstractControl) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { confirmPassword, mayorEdad, ...userData } = this.registerForm.value;

    this.http.post(`${environment.apiUrl}/users/register`, userData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Tu cuenta fue creada. Ahora puedes iniciar sesión.'
        });
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Error al registrar usuario';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      }
    });
  }
}