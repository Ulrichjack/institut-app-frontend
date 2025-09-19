import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-stats-section',
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss']
})
export class StatsSectionComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('statsSection', { static: true }) statsSection!: ElementRef;
  @ViewChild('stat1', { static: true }) stat1!: ElementRef;
  @ViewChild('stat2', { static: true }) stat2!: ElementRef;
  @ViewChild('stat3', { static: true }) stat3!: ElementRef;
  @ViewChild('stat4', { static: true }) stat4!: ElementRef;

  // État de visibilité
  isVisible = false;

  // Observer pour détecter l'intersection
  private observer!: IntersectionObserver;

  // Données des statistiques
  private stats = [
    { element: 'stat1', target: 20, duration: 2000, suffix: '+' },
    { element: 'stat2', target: 98, duration: 2000, suffix: '%' },
    { element: 'stat3', target: 1500, duration: 2500, suffix: '+' },
    { element: 'stat4', target: 95, duration: 2000, suffix: '%' }
  ];

  // Animations en cours
  private activeAnimations: number[] = [];

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngAfterViewInit(): void {
    // Démarrer l'observation après que la vue soit initialisée
    if (this.observer && this.statsSection) {
      this.observer.observe(this.statsSection.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Nettoyer l'observer et les animations
    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearActiveAnimations();
  }

  /**
   * Configuration de l'Intersection Observer
   */
  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px', // Se déclenche quand 80% de l'élément est visible
      threshold: 0.3 // Au moins 30% visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // L'élément devient visible
          this.startAnimations();
        } else {
          // L'élément n'est plus visible
          this.stopAnimations();
        }
      });
    }, options);
  }

  /**
   * Démarre toutes les animations
   */
  private startAnimations(): void {
    // Activer l'état visible pour les animations CSS
    this.isVisible = true;

    // Nettoyer les animations précédentes
    this.clearActiveAnimations();

    // Démarrer les animations de décompte avec délais échelonnés
    this.stats.forEach((stat, index) => {
      const delay = index * 200; // 200ms de délai entre chaque stat

      setTimeout(() => {
        this.animateCounter(stat);
      }, delay);
    });
  }

  /**
   * Arrête toutes les animations
   */
  private stopAnimations(): void {
    this.isVisible = false;
    this.clearActiveAnimations();
    this.resetCounters();
  }

  /**
   * Animation de décompte pour un élément
   */
  private animateCounter(stat: any): void {
    const element = this[stat.element as keyof this] as ElementRef;
    if (!element || !element.nativeElement) return;

    const target = stat.target;
    const duration = stat.duration;
    const startTime = performance.now();

    // Fonction d'easing pour une animation plus fluide
    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Appliquer l'easing
      const easedProgress = easeOutQuart(progress);

      // Calculer la valeur actuelle
      const currentValue = Math.floor(easedProgress * target);

      // Mettre à jour l'affichage
      element.nativeElement.textContent = this.formatNumber(currentValue);

      // Continuer l'animation si pas terminée
      if (progress < 1) {
        const animationId = requestAnimationFrame(animate);
        this.activeAnimations.push(animationId);
      } else {
        // Animation terminée, afficher la valeur finale
        element.nativeElement.textContent = this.formatNumber(target);
      }
    };

    // Démarrer l'animation
    const animationId = requestAnimationFrame(animate);
    this.activeAnimations.push(animationId);
  }

  /**
   * Formate les nombres (ajoute des espaces pour les milliers)
   */
  private formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
  }

  /**
   * Nettoie les animations en cours
   */
  private clearActiveAnimations(): void {
    this.activeAnimations.forEach(id => {
      cancelAnimationFrame(id);
    });
    this.activeAnimations = [];
  }

  /**
   * Remet les compteurs à zéro
   */
  private resetCounters(): void {
    this.stats.forEach(stat => {
      const element = this[stat.element as keyof this] as ElementRef;
      if (element && element.nativeElement) {
        element.nativeElement.textContent = '0';
      }
    });
  }

  /**
   * Méthode publique pour forcer le redémarrage (utile pour le debug)
   */
  public restartAnimations(): void {
    this.startAnimations();
  }

  /**
   * Méthode pour vérifier si une animation est en cours
   */
  public get isAnimating(): boolean {
    return this.activeAnimations.length > 0;
  }
}
