import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-user',
  imports: [
    Sidebar,
    CommonModule,
    CardModule,
    ButtonModule
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
}
