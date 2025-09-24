import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import Swiper core et modules requis
import { register } from 'swiper/element/bundle';

export interface Testimonial {
  name: string;
  content: string;
  photo?: string;
  role?: string;
}

@Component({
  selector: 'app-testimonial-carousel',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.scss']
})
export class TestimonialCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  private intersectionObserver?: IntersectionObserver;

  @Input() testimonials: Testimonial[] = [
    {
      name: 'Fatima',
      content: 'Grâce à la formation esthétique, j\'ai pu ouvrir mon salon et vivre de ma passion.',
      photo: './assets/img/t1.jpg',
      role: 'Diplômée 2024'
    },
    {
      name: 'Sophie',
      content: 'Les ateliers pratiques sont vraiment immersifs, j\'ai appris beaucoup plus vite.',
      photo: 'assets/img/t2.jpg',
      role: 'Pack Maquillage & Onglerie'
    },
    {
      name: 'Yacine',
      content: 'Le suivi personnalisé est un vrai plus, je me suis senti soutenu du début à la fin.',
      photo: 'assets/img/t3.jpg',
      role: 'Formation Coiffure'
    },
    {
      name: 'Chloé',
      content: 'J\'ai pu financer ma formation facilement avec le paiement en plusieurs fois.',
      photo: 'assets/img/t4.jpg',
      role: 'Diplômée 2023'
    },
    {
      name: 'Binta',
      content: 'Nos stages m\'ont permis de rencontrer des pros et d\'avoir mon premier emploi.',
      photo: 'assets/img/t5.jpg',
      role: 'Formation Esthétique'
    },
    {
      name: 'Lucas',
      content: 'J\'ai découvert ma vocation grâce à l\'institut, je recommande à 100% !',
      photo: 'assets/img/t6.jpg',
      role: 'Pack Beauté'
    },
    {
      name: 'Marie',
      content: 'L\'accompagnement post-formation m\'a vraiment aidée dans mes premiers pas professionnels.',
      photo: 'assets/img/t7.jpg',
      role: 'Formation Massage & Spa'
    }
  ];

  constructor(private elementRef: ElementRef) {
    register();
  }

  ngOnInit() {
    // Configuration initiale si nécessaire
  }

  ngAfterViewInit() {
    // Initialiser le swiper d'abord
    setTimeout(() => {
      this.initSwiper();
    }, 100);

    // Puis initialiser les animations au scroll
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

  private initSwiper(): void {
    const swiperEl = document.querySelector('swiper-container') as any;
    if (swiperEl) {
      // Simple initialisation sans écraser la config HTML
      swiperEl.initialize();

      // Forcer la mise à jour si nécessaire
      setTimeout(() => {
        if (swiperEl.swiper) {
          swiperEl.swiper.update();
        }
      }, 50);

      // Ajouter une classe pour les animations personnalisées
      swiperEl.classList.add('swiper-container-animated');
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
          // Pour le titre
          if (entry.target.tagName === 'H2' && entry.target.textContent?.includes('TÉMOIGNAGES')) {
            entry.target.classList.add('animate-in');
          }

          // Pour tout le carousel
          if (entry.target.classList.contains('testimonial-carousel')) {
            entry.target.classList.add('animate-in');

            // Animer les cartes individuelles avec délai
            setTimeout(() => {
              this.animateTestimonialCards();
            }, 300);
          }

          // Pour les cartes individuelles si elles sont observées séparément
          if (entry.target.classList.contains('testimonial-card')) {
            entry.target.classList.add('animate-in');
          }

        } else {
          // Rejouer les animations quand l'élément sort puis revient
          if (entry.target.classList.contains('testimonial-carousel')) {
            entry.target.classList.remove('animate-in');
            // Retirer aussi l'animation des cartes
            const cards = entry.target.querySelectorAll('.testimonial-card');
            cards.forEach((card: Element) => {
              card.classList.remove('animate-in');
            });
          } else if (entry.target.tagName === 'H2') {
            entry.target.classList.remove('animate-in');
          } else if (entry.target.classList.contains('testimonial-card')) {
            entry.target.classList.remove('animate-in');
          }
        }
      });
    }, options);

    // Observer les éléments après un délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      const elementsToAnimate = this.elementRef.nativeElement.querySelectorAll(
        'h2, .testimonial-carousel'
      );

      elementsToAnimate.forEach((element: Element) => {
        this.intersectionObserver?.observe(element);
      });
    }, 300);
  }

  private animateTestimonialCards(): void {
    // Animer chaque carte de témoignage avec des délais échelonnés
    const cards = this.elementRef.nativeElement.querySelectorAll('.testimonial-card');

    cards.forEach((card: Element, index: number) => {
      // Ajouter une classe de délai basée sur l'index
      card.classList.add(`delay-${Math.min(index + 1, 7)}`);

      // Déclencher l'animation avec un petit délai
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 150); // Délai de 150ms entre chaque carte
    });
  }

  // Méthode pour réanimer les cartes si nécessaire (appelée par le swiper)
  public onSlideChange(): void {
    // Ajouter un petit effet sur la slide active
    setTimeout(() => {
      const activeSlide = this.elementRef.nativeElement.querySelector('.swiper-slide-active .testimonial-card');
      if (activeSlide) {
        activeSlide.style.transform = 'translateY(0) scale(1.02)';
        setTimeout(() => {
          activeSlide.style.transform = '';
        }, 300);
      }
    }, 100);
  }

  // Méthode pour gérer le hover sur les cartes (optionnel)
  public onCardHover(event: MouseEvent, entering: boolean): void {
    const card = event.currentTarget as HTMLElement;
    if (entering) {
      card.style.transform = 'translateY(-8px) scale(1.05)';
    } else {
      card.style.transform = '';
    }
  }
}
