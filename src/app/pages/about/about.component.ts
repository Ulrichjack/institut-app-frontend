import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';

interface StatElement {
  element: ElementRef;
  target: number;
  suffix: string;
  hasAnimated: boolean;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {

  // Références vers les éléments avec ViewChild
  @ViewChildren('stat1, stat2, stat3, stat4') statElements!: QueryList<ElementRef>;
  @ViewChildren('valueCard1, valueCard2, valueCard3, valueCard4') valueCards!: QueryList<ElementRef>;
  @ViewChildren('gridCard1, gridCard2, gridCard3, gridCard4') gridCards!: QueryList<ElementRef>;


  private gridCardObserver: IntersectionObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private statObserver: IntersectionObserver | null = null;
  private stats: StatElement[] = [];

  constructor() {}

  ngOnInit(): void {
    // Initialisation des animations
    this.initializeAnimations();
  }

  ngAfterViewInit(): void {
    // Configuration des observers après que la vue soit initialisée
    setTimeout(() => {
      this.setupStatisticsAnimation();
      this.setupValueCardsAnimation();
      this.setupGridCardsAnimation();
    }, 100);
  }

  ngOnDestroy(): void {
    // Nettoyage des observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.statObserver) {
      this.statObserver.disconnect();
    }
  }

  private initializeAnimations(): void {
    // Ajouter les classes CSS pour les animations initiales
    setTimeout(() => {
      const subtitle = document.querySelector('.about-subtitle');
      if (subtitle) {
        subtitle.classList.add('fade-in-up');
      }
    }, 300);
  }

 private setupStatisticsAnimation(): void {
  if (!this.statElements) return;

  this.stats = this.statElements.map((elementRef, index) => {
    const counterElement = elementRef.nativeElement.querySelector('.animated-counter');
    if (counterElement) {
      const target = parseInt(counterElement.getAttribute('data-target') || '0', 10);
      const suffix = counterElement.getAttribute('data-suffix') || '';

      return {
        element: elementRef,
        target: target,
        suffix: suffix,
        hasAnimated: false
      };
    }
    return null;
  }).filter(stat => stat !== null) as StatElement[];

  this.statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const stat = this.stats.find(s => s.element.nativeElement === entry.target);
      if (!stat) return;
      if (entry.isIntersecting) {
        if (!stat.hasAnimated) {
          this.animateCounter(stat);
          stat.hasAnimated = true;
        }
      } else {
        // Si la section n'est plus visible, reset pour qu'elle puisse se réanimer la prochaine fois
        stat.hasAnimated = false;
        const counterElement = stat.element.nativeElement.querySelector('.animated-counter');
        if (counterElement) {
          counterElement.classList.remove('visible');
          counterElement.textContent = `0${stat.suffix}`;
        }
      }
    });
  }, {
    threshold: 0.3
  });

  this.stats.forEach(stat => {
    this.statObserver?.observe(stat.element.nativeElement);
  });
}

private setupValueCardsAnimation(): void {
  if (!this.valueCards) return;

  this.intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      const delay = element.style.animationDelay || '0ms';
      const delayMs = parseInt(delay.replace('ms', ''), 10);

      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add('animate-in');
        }, delayMs);
      } else {
        // Si carte n'est plus visible, reset pour qu'elle puisse se réanimer la prochaine fois
        element.classList.remove('animate-in');
      }
    });
  }, {
    threshold: 0.2
  });

  this.valueCards.forEach(card => {
    this.intersectionObserver?.observe(card.nativeElement);
  });
}

  private animateCounter(stat: StatElement): void {
    const counterElement = stat.element.nativeElement.querySelector('.animated-counter');
    if (!counterElement) return;

    const duration = 2000 + Math.random() * 1000; // Durée variable pour plus de naturel
    const startTime = performance.now();

    // Marquer comme visible pour les animations CSS
    counterElement.classList.add('visible');

          const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Fonction d'easing pour un effet plus fluide
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * stat.target);

      // Mettre à jour le texte du compteur
      counterElement.textContent = `${currentCount}${stat.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation terminée, s'assurer que la valeur finale est correcte
        counterElement.textContent = `${stat.target}${stat.suffix}`;
      }
    };

    requestAnimationFrame(animate);
  }



  // Méthodes utilitaires pour les animations personnalisées
  public onStatHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const statCard = target.closest('.about-stat');
    if (statCard) {
      statCard.classList.add('pulse-hover');
      setTimeout(() => {
        statCard.classList.remove('pulse-hover');
      }, 300);
    }
  }

  public onValueCardHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const valueCard = target.closest('.value-item');
    if (valueCard) {
      // Ajouter un effet de brillance
      valueCard.classList.add('glow-hover');
      setTimeout(() => {
        valueCard.classList.remove('glow-hover');
      }, 500);
    }
  }

  // Méthode pour gérer les clics sur les boutons CTA
  public onCtaClick(event: MouseEvent): void {
    const button = event.target as HTMLElement;
    const ripple = button.querySelector('.button-ripple') as HTMLElement;

    if (ripple) {
      // Animation de ripple
      ripple.style.animation = 'none';
      setTimeout(() => {
        ripple.style.animation = 'ripple 0.6s ease-out';
      }, 10);
    }
  }

  // Méthode pour scroll fluide vers les sections
  public scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Méthodes pour les animations parallax (optionnel)
  public onScroll(): void {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-section::before');

    parallaxElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const speed = 0.5;
      htmlElement.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }

  // Méthode pour réinitialiser les animations si nécessaire
  public resetAnimations(): void {
    // Réinitialiser les statistiques
    this.stats.forEach(stat => {
      stat.hasAnimated = false;
      const counterElement = stat.element.nativeElement.querySelector('.animated-counter');
      if (counterElement) {
        counterElement.classList.remove('visible');
        counterElement.textContent = `0${stat.suffix}`;
      }
    });

    // Réinitialiser les cartes de valeurs
    this.valueCards?.forEach(card => {
      card.nativeElement.classList.remove('animate-in');
    });

    // Reconfigurer les observers
    setTimeout(() => {
      this.setupStatisticsAnimation();
      this.setupValueCardsAnimation();
    }, 100);
  }

  // Méthode pour précharger les animations
  private preloadAnimations(): void {
    // Ajouter des classes pour éviter le flash de contenu non stylé
    const animatedElements = document.querySelectorAll('.value-item, .floating-card');
    animatedElements.forEach(element => {
      element.classList.add('animation-ready');
    });
  }

  // Méthode pour optimiser les performances
  private optimizeAnimations(): void {
    // Réduire les animations si l'utilisateur préfère les animations réduites
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
private setupGridCardsAnimation(): void {
  if (!this.gridCards) return;

  this.gridCardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      const delay = element.style.animationDelay || '0ms';
      const delayMs = parseInt(delay.replace('ms', ''), 10);

      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add('animate-in');
        }, delayMs);
      } else {
        // Si carte n'est plus visible, reset pour qu'elle puisse se réanimer la prochaine fois
        element.classList.remove('animate-in');
      }
    });
  }, {
    threshold: 0.2
  });

  this.gridCards.forEach(card => {
    this.gridCardObserver?.observe(card.nativeElement);
  });
}

}
