import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HasPermissionDirective } from "../../directives/has-permission.directive";

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    CardModule,
    TableModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    HasPermissionDirective
],
  templateUrl: './groups.html',
  styleUrls: ['./groups.css']
})
export class Groups {

  modoEdicion: boolean = false;
indexEditando: number | null = null;
  grupos = [
    {
      nivel: 'Básico',
      autor: 'Juan Pérez',
      nombre: 'Grupo Angular',
      integrantes: 10,
      tickets: 3,
      descripcion: 'Grupo de introducción a Angular'
    },
    {
      nivel: 'Intermedio',
      autor: 'Laura Gómez',
      nombre: 'Grupo PrimeNG',
      integrantes: 8,
      tickets: 12,
      descripcion: 'Componentes avanzados con PrimeNG'
    },
    {
      nivel: 'Avanzado',
      autor: 'Carlos Ruiz',
      nombre: 'Grupo FullStack',
      integrantes: 5,
      tickets: 5,
      descripcion: 'Proyecto completo frontend + backend'
    }
  ];

visible: boolean = false;

nuevoGrupo = {
  nivel: '',
  autor: '',
  nombre: '',
  integrantes: 0,
  tickets: 0,
  descripcion: ''
};

abrirModal() {
  this.visible = true;
}

cerrarModal() {
  this.visible = false;
}

resetFormulario() {

  this.nuevoGrupo = {
    nivel: '',
    autor: '',
    nombre: '',
    integrantes: 0,
    tickets: 0,
    descripcion: ''
  };

  this.modoEdicion = false;
  this.indexEditando = null;
  this.visible = false;
}

agregarGrupo() {

  if (this.modoEdicion && this.indexEditando !== null) {

    this.grupos[this.indexEditando] = { ...this.nuevoGrupo };

  } else {

    this.grupos.push({ ...this.nuevoGrupo });

  }

  this.resetFormulario();
}

eliminarGrupo(index: number) {
  this.grupos.splice(index, 1);
}

editarGrupo(grupo: any, index: number) {

  this.modoEdicion = true;
  this.indexEditando = index;

  this.nuevoGrupo = { ...grupo };

  this.visible = true;
}

verDashboard(grupo: any) {

  this.router.navigate(['/groups-dashboard', grupo.nombre]);

}
constructor(private router: Router) {}
}