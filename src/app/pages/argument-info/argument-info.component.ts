import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface ArgumentInfo {
  title: string;
  description: string;
  icon?: string; // optionnel, si tu veux une icône
}

@Component({
  selector: 'app-argument-info',
  imports: [CommonModule],
  templateUrl: './argument-info.component.html',
  styleUrls: ['./argument-info.component.scss']
})
export class ArgumentInfoComponent {
  @Input() arguments: ArgumentInfo[] = [];
  @Input() columns: number = 3; // nombre d’arguments par ligne (défaut 3)
}
