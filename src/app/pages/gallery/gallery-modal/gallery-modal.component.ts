import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { GalleryImage } from '../../../shared/services/gallery.service';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-gallery-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' }))
      ])
    ])
  ]
})
export class GalleryModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() images: GalleryImage[] = [];
  @Input() currentIndex: number = 0;
  @Input() isVisible: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() indexChange = new EventEmitter<number>();

  currentImage: GalleryImage | null = null;
  isImageLoading: boolean = false;

  // Catégories pour l'affichage
  categories = [
    { value: 'FORMATION', label: 'Formation' },
    { value: 'EVENEMENT', label: 'Événement' },
    { value: 'INSTITUT', label: 'Institut' }
  ];

  ngOnInit() {
    this.updateCurrentImage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentIndex'] || changes['images']) {
      this.updateCurrentImage();
    }

    if (changes['isVisible']) {
      if (this.isVisible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  // Gestion des touches clavier
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isVisible) return;

    switch(event.key) {
      case 'Escape':
        this.closeModal();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextImage();
        break;
    }
  }

  // Empêcher le scroll du body quand le modal est ouvert
  @HostListener('document:keydown.space', ['$event'])
  @HostListener('document:keydown.arrowUp', ['$event'])
  @HostListener('document:keydown.arrowDown', ['$event'])
  preventScroll(event: KeyboardEvent) {
    if (this.isVisible) {
      event.preventDefault();
    }
  }

  updateCurrentImage() {
    if (this.images && this.images.length > 0 && this.currentIndex >= 0 && this.currentIndex < this.images.length) {
      this.currentImage = this.images[this.currentIndex];
      this.isImageLoading = true;
    } else {
      this.currentImage = null;
    }
  }

  closeModal() {
    this.close.emit();
  }

  previousImage() {
    if (this.currentIndex > 0) {
      const newIndex = this.currentIndex - 1;
      this.indexChange.emit(newIndex);
    }
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      const newIndex = this.currentIndex + 1;
      this.indexChange.emit(newIndex);
    }
  }

  goToImage(index: number) {
    if (index >= 0 && index < this.images.length) {
      this.indexChange.emit(index);
    }
  }

  onImageLoad() {
    this.isImageLoading = false;
  }

  onImageError() {
    this.isImageLoading = false;
    console.error('Erreur de chargement de l\'image');
  }

  isEventImage(image: GalleryImage): boolean {
    return image.categorie === 'EVENEMENT';
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  downloadImage() {
    if (this.currentImage) {
      const link = document.createElement('a');
      link.href = this.currentImage.url;
      link.download = this.currentImage.titre || 'image';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  shareImage() {
    if (this.currentImage && navigator.share) {
      navigator.share({
        title: this.currentImage.titre,
        text: this.currentImage.description,
        url: this.currentImage.url
      }).catch(console.error);
    } else if (this.currentImage) {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(this.currentImage.url).then(() => {
        console.log('URL copiée dans le presse-papiers');
      }).catch(console.error);
    }
  }
}
