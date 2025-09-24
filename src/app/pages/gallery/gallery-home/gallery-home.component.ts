import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { GalleryImage, GalleryService } from '../../../core/services/gallery.service';
import { CommonModule } from '@angular/common';
import { GalleryModalComponent } from "../gallery-modal/gallery-modal.component";
import { ArgumentInfo, ArgumentInfoComponent } from '../../argument-info/argument-info.component';

@Component({
  selector: 'app-gallery-home',
  imports: [CommonModule, GalleryModalComponent, ArgumentInfoComponent],
  templateUrl: './gallery-home.component.html',
  styleUrls: ['./gallery-home.component.scss']
})
export class GalleryHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  images: GalleryImage[] = [];
  modalOpen = false;
  modalIndex = 0;
  private intersectionObserver?: IntersectionObserver;

  constructor(
    private galleryService: GalleryService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.galleryService.getHomeImages().subscribe(data => {
      this.images = data;
      console.log(this.images);
    });
  }

  ngAfterViewInit(): void {
    // Initialiser les animations de scroll après le rendu de la vue
    this.initScrollAnimations();
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
          // Pour les photos de réalisations
          if (entry.target.classList.contains('image-item')) {
            entry.target.classList.add('animate-in');
          }

          // Pour les arguments (animation douce qui monte)
          if (entry.target.classList.contains('argument-item')) {
            entry.target.classList.add('animate-in');
          }

          // Pour les autres éléments avec animation générale
          if (entry.target.classList.contains('slide-up-gentle')) {
            entry.target.classList.add('visible');
          }

          // Pour le slogan
          if (entry.target.classList.contains('beauty-slogan')) {
            entry.target.classList.add('animate-in');
          }

          // Optionnel : arrêter d'observer après animation (pour performance)
          // this.intersectionObserver?.unobserve(entry.target);
        } else {
          // Rejouent les animations quand l'élément sort puis revient
          entry.target.classList.remove('animate-in', 'visible');
        }
      });
    }, options);

    // Observer tous les éléments après un délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      const elementsToAnimate = this.elementRef.nativeElement.querySelectorAll(
        '.image-item, .beauty-slogan, .slide-up-gentle, .argument-item'
      );

      elementsToAnimate.forEach((element: Element) => {
        this.intersectionObserver?.observe(element);
      });
    }, 150);
  }

  openModal(idx: number): void {
    this.modalOpen = true;
    this.modalIndex = idx;

    // Ajouter une animation d'ouverture douce
    document.body.style.overflow = 'hidden'; // Empêcher le scroll du body
  }

  closeModal(): void {
    this.modalOpen = false;
    document.body.style.overflow = 'auto'; // Rétablir le scroll
  }

  // Animation au clic sur une image
  onImageClick(event: Event, index: number): void {
    const target = event.currentTarget as HTMLElement;

    // Effet de "pulse" au clic
    target.style.transform = 'scale(0.95)';

    setTimeout(() => {
      target.style.transform = '';
      this.openModal(index);
    }, 150);
  }

  argumentsList: ArgumentInfo[] = [
    {
    title: 'Devenez expert(e) dans la beauté qui vous passionne',
    description: 'Maîtrisez des compétences recherchées en coiffure, esthétique, maquillage, onglerie ou cosmétique, grâce à nos formations conçues pour révéler votre talent unique.'
  },
  {
    title: 'Programmes sur-mesure pour votre réussite',
    description: 'Composez votre parcours : formation ciblée ou pack complet, avec des modules adaptés à vos ambitions. Multipliez les compétences, multipliez les opportunités !'
  },
  {
    title: 'Des stages, du concret, du réseau',
    description: 'Plongez au cœur du métier : nos cursus incluent des stages auprès de professionnels, pour apprendre sur le terrain et tisser votre réseau.'
  },
  {
    title: 'Investissez sans stress, payez en plusieurs fois',
    description: 'Libérez-vous des contraintes : nos facilités de paiement vous permettent d’apprendre l’esprit tranquille, étalez les frais, démarrez sereinement.'
  },
  {
    title: 'Un avenir qui vous ressemble : salarié(e), entrepreneur, artiste',
    description: 'Ouvrez-vous à tous les horizons : institut, salon, freelance, création d’entreprise… Nos diplômé(e)s sont partout où la beauté s’exprime.'
  },
  {
    title: 'Vous êtes accompagné(e) à chaque étape',
    description: 'Coaching, conseils, suivi personnalisé : notre équipe vous guide, vous motive et vous aide à franchir chaque étape vers votre réussite professionnelle.'
  }
  ];

}



