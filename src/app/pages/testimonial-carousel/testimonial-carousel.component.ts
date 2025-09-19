import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnInit } from '@angular/core';
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
export class TestimonialCarouselComponent implements OnInit, AfterViewInit {

  @Input() testimonials: Testimonial[] = [
    {
      name: 'Fatima',
      content: 'Grâce à la formation esthétique, j\'ai pu ouvrir mon salon et vivre de ma passion.',
      photo: './assets/img/testimonial-1.jpg',
      role: 'Diplômée 2024'
    },
    {
      name: 'Sophie',
      content: 'Les ateliers pratiques sont vraiment immersifs, j\'ai appris beaucoup plus vite.',
      photo: 'assets/img/sophie.jpg',
      role: 'Pack Maquillage & Onglerie'
    },
    {
      name: 'Yacine',
      content: 'Le suivi personnalisé est un vrai plus, je me suis senti soutenu du début à la fin.',
      photo: 'assets/img/yacine.jpg',
      role: 'Formation Coiffure'
    },
    {
      name: 'Chloé',
      content: 'J\'ai pu financer ma formation facilement avec le paiement en plusieurs fois.',
      photo: 'assets/img/chloe.jpg',
      role: 'Diplômée 2023'
    },
    {
      name: 'Binta',
      content: 'Nos stages m\'ont permis de rencontrer des pros et d\'avoir mon premier emploi.',
      photo: 'assets/img/binta.jpg',
      role: 'Formation Esthétique'
    },
    {
      name: 'Lucas',
      content: 'J\'ai découvert ma vocation grâce à l\'institut, je recommande à 100% !',
      photo: 'assets/img/lucas.jpg',
      role: 'Pack Beauté'
    },
    {
      name: 'Marie',
      content: 'L\'accompagnement post-formation m\'a vraiment aidée dans mes premiers pas professionnels.',
      photo: 'assets/img/marie.jpg',
      role: 'Formation Massage & Spa'
    }
  ];

  constructor() {
    register();
  }

  ngOnInit() {
    // Configuration initiale si nécessaire
  }

  ngAfterViewInit() {
    // Attendre que le DOM soit complètement rendu
    setTimeout(() => {
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
      }
    }, 100);
  }
}
