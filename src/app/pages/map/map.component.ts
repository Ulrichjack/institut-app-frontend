import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { ContactModalComponent } from "../contact-modal/contact-modal.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  imports: [ContactModalComponent, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  showContactModal = false;
  private intersectionObserver?: IntersectionObserver;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Configuration initiale si nécessaire
  }

  ngAfterViewInit(): void {
    // Initialiser les animations de scroll après le rendu de la vue
    setTimeout(() => {
      this.initScrollAnimations();
    }, 200);
  }

  ngOnDestroy(): void {
    // Nettoyer l'observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private initScrollAnimations(): void {
    // Configuration de l'Intersection Observer
    const options: IntersectionObserverInit = {
      threshold: 0.15, // Se déclenche quand 15% de l'élément est visible
      rootMargin: '80px' // Déclenche 80px avant que l'élément soit visible
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Pour le titre principal
          if (entry.target.tagName === 'H2' && entry.target.textContent?.includes('Localisation')) {
            entry.target.classList.add('animate-in');
          }

          // Pour toute la section localisation
          if (entry.target.classList.contains('localisation-section')) {
            entry.target.classList.add('animate-in');

            // Animer les éléments enfants avec délais
            setTimeout(() => {
              this.animateChildElements();
            }, 300);
          }

          // Pour les éléments individuels
          if (entry.target.classList.contains('localisation-map') ||
              entry.target.classList.contains('localisation-info')) {
            entry.target.classList.add('animate-in');
          }

        } else {
          // Rejouer les animations quand l'élément sort puis revient
          if (entry.target.classList.contains('localisation-section')) {
            entry.target.classList.remove('animate-in');
            // Retirer aussi l'animation des éléments enfants
            const childElements = entry.target.querySelectorAll('.localisation-map, .localisation-info');
            childElements.forEach((element: Element) => {
              element.classList.remove('animate-in');
            });
          } else if (entry.target.tagName === 'H2') {
            entry.target.classList.remove('animate-in');
          } else {
            entry.target.classList.remove('animate-in');
          }
        }
      });
    }, options);

    // Observer les éléments après un délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      const elementsToAnimate = this.elementRef.nativeElement.querySelectorAll(
        'h2, .localisation-section, .localisation-map, .localisation-info'
      );

      elementsToAnimate.forEach((element: Element) => {
        this.intersectionObserver?.observe(element);
      });
    }, 300);
  }

  private animateChildElements(): void {
    // Animer la carte et les infos avec des délais différents
    const mapElement = this.elementRef.nativeElement.querySelector('.localisation-map');
    const infoElement = this.elementRef.nativeElement.querySelector('.localisation-info');

    if (mapElement) {
      setTimeout(() => {
        mapElement.classList.add('animate-in');
      }, 100);
    }

    if (infoElement) {
      setTimeout(() => {
        infoElement.classList.add('animate-in');
      }, 200);
    }
  }

  openContactModal(): void {
    this.showContactModal = true;
    document.body.style.overflow = 'hidden'; // Empêcher le scroll du body

    // Ajouter une animation d'ouverture douce au modal
    setTimeout(() => {
      const modal = this.elementRef.nativeElement.querySelector('app-contact-modal');
      if (modal) {
        modal.style.animation = 'fadeInScale 0.3s ease-out forwards';
      }
    }, 10);
  }

  closeContactModal(): void {
    // Animation de fermeture douce
    const modal = this.elementRef.nativeElement.querySelector('app-contact-modal');
    if (modal) {
      modal.style.animation = 'fadeOutScale 0.2s ease-in forwards';

      setTimeout(() => {
        this.showContactModal = false;
        document.body.style.overflow = 'auto'; // Rétablir le scroll
      }, 200);
    } else {
      this.showContactModal = false;
      document.body.style.overflow = 'auto';
    }
  }

  // Méthode pour animer le clic sur le bouton contact
  onContactButtonClick(event: Event): void {
    const button = event.currentTarget as HTMLElement;

    // Effet de "pulse" au clic
    button.style.transform = 'scale(0.95)';

    setTimeout(() => {
      button.style.transform = '';
      this.openContactModal();
    }, 100);
  }

  // Méthode pour gérer l'interaction avec la carte
  onMapInteraction(): void {
    const mapElement = this.elementRef.nativeElement.querySelector('.localisation-map iframe');
    if (mapElement) {
      mapElement.style.transform = 'translateY(-2px) scale(1.01)';

      setTimeout(() => {
        mapElement.style.transform = '';
      }, 300);
    }
  }

  // Méthode pour animer les éléments au survol
  onElementHover(event: MouseEvent, entering: boolean): void {
    const element = event.currentTarget as HTMLElement;

    if (entering) {
      if (element.classList.contains('localisation-info')) {
        element.style.transform = 'translateX(0) scale(1.02) translateY(-4px)';
      } else if (element.classList.contains('localisation-map')) {
        const iframe = element.querySelector('iframe') as HTMLElement;
        if (iframe) {
          iframe.style.transform = 'translateY(-4px)';
        }
      }
    } else {
      element.style.transform = '';
      const iframe = element.querySelector('iframe') as HTMLElement;
      if (iframe) {
        iframe.style.transform = '';
      }
    }
  }
}
