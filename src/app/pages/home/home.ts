import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home {

}