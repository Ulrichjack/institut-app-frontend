import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormationListDto } from '../../shared/dtos/formation-list-dto.model';
import { FormationService } from '../../shared/services/formation.service';
import { ApiResponse } from '../../shared/dtos/api-response.model';

@Component({
  selector: 'app-home-formations',
  templateUrl: './home-formations.component.html',
  styleUrls: ['./home-formations.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeFormationsComponent implements OnInit, AfterViewInit {

  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('formationsSection') formationsSection!: ElementRef;

  formations: FormationListDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  private observer!: IntersectionObserver;

  constructor(
    private formationService: FormationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLatestFormations();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initScrollAnimations(): void {
    // Configuration de l'Intersection Observer
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        } else {
          // Réinitialise l'animation quand l'élément sort de vue (optionnel)
          entry.target.classList.remove('animate-in');
        }
      });
    }, options);

    // Observe tous les éléments avec la classe 'animate-on-scroll'
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => this.observer.observe(el));
  }

  loadLatestFormations(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.formationService.getFormationsList(0, 6).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.formations = response.data.content;
          // Réinitialise les animations après le chargement des données
          setTimeout(() => this.initScrollAnimations(), 100);
        } else {
          this.errorMessage = response.message || 'Aucune formation à afficher.';
          this.formations = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des formations.';
        console.error(err);
      }
    });
  }

  voirDetails(slug: string): void {
    this.router.navigate(['/formations', slug]);
  }

  getCloudinaryPreviewUrl(url?: string): string {
    if (!url) return 'assets/images/default-image.jpg';
    return url.replace('/upload/', '/upload/w_600,h_400,c_fill,q_auto/');
  }

  // Méthode pour ajouter un délai d'animation aux cartes
  getAnimationDelay(index: number): string {
    return `${index * 0.1}s`;
  }
}
