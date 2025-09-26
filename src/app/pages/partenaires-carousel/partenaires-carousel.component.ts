import { Component, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface pour typer les partenaires
export interface Partenaire {
  nom: string;
  logo: string;
}

@Component({
  selector: 'app-partenaires-carousel',
  templateUrl: './partenaires-carousel.component.html',
  styleUrls: ['./partenaires-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PartenairesCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  private intersectionObserver?: IntersectionObserver;

  partenaires: Partenaire[] = [
  { nom: `Ministère de l'emploi et de la Formation professionnelle`, logo: `assets/img/Minefop.jpg` },
  { nom: `Institut international de formation professionnelle TBZ`, logo: `assets/img/IIFPI.jpg` },
  { nom: `Beauty's Company and Engineering Sarl`, logo: `assets/img/teb.jpg` },
  { nom: `Institut De Formation Professionnelle ED GLAM'S BEAUTY`, logo: `assets/img/ed.jpg` },
  { nom: `KENFORT BEAUTY & NAILS`, logo: `assets/img/Beaty&Nails.jpg` }


  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Aucune configuration initiale nécessaire
  }

  ngAfterViewInit(): void {
    // Initialiser les animations au scroll avec délai
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
    const options: IntersectionObserverInit = {
      threshold: 0.15,
      rootMargin: '50px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Pour le titre
          if (entry.target.classList.contains('partenaires-title')) {
            entry.target.classList.add('animate-in');
          }

          // Pour la section partenaires
          if (entry.target.classList.contains('partenaires')) {
            entry.target.classList.add('animate-in');

            // Animer les cartes avec délai
            setTimeout(() => {
              this.animateCards();
            }, 400);
          }
        } else {
          // Retirer les animations pour rejouer quand l'élément revient
          if (entry.target.classList.contains('partenaires')) {
            entry.target.classList.remove('animate-in');
            this.resetCardsAnimation();
          } else if (entry.target.classList.contains('partenaires-title')) {
            entry.target.classList.remove('animate-in');
          }
        }
      });
    }, options);

    // Observer les éléments
    setTimeout(() => {
      const elementsToAnimate = this.elementRef.nativeElement.querySelectorAll(
        '.partenaires-title, .partenaires'
      );

      elementsToAnimate.forEach((element: Element) => {
        this.intersectionObserver?.observe(element);
      });
    }, 300);
  }

  private animateCards(): void {
    const cards = this.elementRef.nativeElement.querySelectorAll('.partner-card');
    cards.forEach((card: Element) => {
      card.classList.add('animate-in');
    });
  }

  private resetCardsAnimation(): void {
    const cards = this.elementRef.nativeElement.querySelectorAll('.partner-card');
    cards.forEach((card: Element) => {
      card.classList.remove('animate-in');
    });
  }

  // TrackBy function pour optimiser les performances
  public trackByPartenaireNom(index: number, partenaire: Partenaire): string {
    return partenaire.nom + partenaire.logo;
  }

  // Méthode pour gérer le hover sur les logos
  public onLogoHover(event: MouseEvent, entering: boolean): void {
    const card = event.currentTarget as HTMLElement;

    if (entering) {
      // Effet de hover déjà géré par CSS
      card.style.zIndex = '10';
    } else {
      card.style.zIndex = '';
    }
  }
}
