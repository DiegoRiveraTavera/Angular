import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';

// PrimeNG
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    CardModule
  ],
  templateUrl: './groups.html',
  styleUrls: ['./groups.css']
})
export class Groups { }
