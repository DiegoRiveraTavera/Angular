import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    CheckboxModule,
    RouterModule
  ]
})
export class RegisterComponent {

  registerForm;

  constructor(private fb: FormBuilder) {

    this.registerForm = this.fb.group(
      {
        usuario: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        nombreCompleto: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/.*#.*/)
        ]],
        confirmPassword: ['', Validators.required],
        mayorEdad: [false, Validators.requiredTrue]
      },
      {
        validators: this.passwordsMatchValidator
      }
    );
  }

  passwordsMatchValidator(form: AbstractControl) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    return pass === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulario válido');
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}