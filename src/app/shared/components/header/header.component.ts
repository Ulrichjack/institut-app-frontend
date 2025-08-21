import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  // Ajout d'un style inline de débogage pour s'assurer que le composant est visible
  styles: [`
    :host {
      display: block;
      width: 100%;
      background-color: #f8f9fa;
    }
    .header-debug {
      padding: 10px;
      background-color: #007bff;
      color: white;
      text-align: center;
      margin-bottom: 10px;
    }
  `]
})
export class HeaderComponent {

}
