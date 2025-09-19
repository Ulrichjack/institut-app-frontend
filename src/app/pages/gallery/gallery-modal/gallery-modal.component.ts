import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GalleryImage } from '../../../core/services/gallery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-modal',
  imports: [CommonModule],
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss']
})
export class GalleryModalComponent {
  @Input() images: GalleryImage[] = [];
  @Input() currentIndex: number = 0;
  @Output() close = new EventEmitter<void>();

  get currentImage(): GalleryImage | undefined {
    return this.images[this.currentIndex];
  }

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }
  onClose(): void {
    this.close.emit();
  }
}
