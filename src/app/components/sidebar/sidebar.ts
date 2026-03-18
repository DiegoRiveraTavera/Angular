import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HasPermissionDirective } from "../../directives/has-permission.directive";

@Component({
  selector: 'app-sidebar',
  standalone: true,          
  imports: [RouterModule, HasPermissionDirective],       
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']   
})
export class Sidebar {}