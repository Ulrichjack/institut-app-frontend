import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormationListDto } from '../../shared/dtos/formation-list-dto.model';
import { FormationService } from '../../shared/services/formation.service';
import { ApiResponse } from '../../shared/dtos/api-response.model';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FormationsComponent implements OnInit, OnDestroy {
  // Données principales
  formations: FormationListDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  // Propriétés pour la pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 9; // 3 formations par ligne sur 3 lignes

  searchQuery: string = '';
 searchPageSize: number = 9;

  // Subject pour la gestion de la destruction du composant
  private destroy$ = new Subject<void>();

  constructor(
    private formationService: FormationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadFormations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les formations depuis l'API
   * @param page - Numéro de la page à charger (par défaut: page courante)
   */
  loadFormations(page: number = this.currentPage): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.currentPage = page;

    this.formationService.getFormationsList(page, this.pageSize)
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300) // Évite les appels trop fréquents
      )
      .subscribe({
        next: (response: ApiResponse<any>) => {
          this.handleSuccessResponse(response);
        },
        error: (err) => {
          this.handleErrorResponse(err);
        }
      });
  }

  /**
   * Gère la réponse de succès de l'API
   * @param response - Réponse de l'API
   */
  private handleSuccessResponse(response: ApiResponse<any>): void {
    this.isLoading = false;

    if (response.success && response.data) {
      this.formations = response.data.content || [];
      this.totalPages = response.data.totalPages || 0;
      this.totalElements = response.data.totalElements || 0;

      // Scroll vers le haut après changement de page
      if (this.currentPage > 0) {
        this.scrollToTop();
      }
    } else {
      this.errorMessage = response.message || 'Aucune formation trouvée.';
      this.formations = [];
    }
  }

  /**
   * Gère les erreurs de l'API
   * @param err - Erreur retournée
   */
  private handleErrorResponse(err: any): void {
    this.isLoading = false;
    this.formations = [];

    if (err.status === 0) {
      this.errorMessage = 'Problème de connexion. Vérifiez votre connexion internet.';
    } else if (err.status >= 500) {
      this.errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
    } else if (err.status === 404) {
      this.errorMessage = 'Aucune formation disponible pour le moment.';
    } else {
      this.errorMessage = 'Erreur lors du chargement des formations.';
    }

    console.error('Erreur lors du chargement des formations:', err);
  }

  /**
   * Navigue vers la page de détail d'une formation
   * @param slug - Identifiant unique de la formation
   */
 voirDetails(slug: string): void {
  if (!slug) {
    console.error('Slug de formation manquant');
    return;
  }
  this.router.navigate(['/formations', slug]);
}

  /**
   * Gère le changement de page
   * @param page - Nouvelle page à afficher
   */
  // onPageChange(page: number): void {
  //   if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
  //     this.loadFormations(page);
  //   }
  // }

  /**
   * Retourne la liste des pages visibles dans la pagination
   * Affiche un maximum de 7 pages avec des ellipses si nécessaire
   */
  getVisiblePages(): number[] {
    const maxVisiblePages = 7;
    const pages: number[] = [];

    if (this.totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si <= 7 pages
      return Array.from({ length: this.totalPages }, (_, i) => i);
    }

    const startPage = Math.max(0, this.currentPage - 3);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + 3);

    // Toujours inclure la première page
    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) {
        pages.push(-1); // Marqueur pour les ellipses
      }
    }

    // Pages autour de la page courante
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Toujours inclure la dernière page
    if (endPage < this.totalPages - 1) {
      if (endPage < this.totalPages - 2) {
        pages.push(-1); // Marqueur pour les ellipses
      }
      pages.push(this.totalPages - 1);
    }

    return pages;
  }

  /**
   * Fonction de tracking pour ngFor pour améliorer les performances
   * @param index - Index de l'élément
   * @param formation - Formation concernée
   */
  trackByFormation(index: number, formation: FormationListDto): string {
    return formation.slug || formation.nom || index.toString();
  }

  /**
   * Scroll fluide vers le haut de la page
   */
  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Retourne les pages sous forme d'array pour la pagination simple
   * (garde la compatibilité avec l'ancien système)
   */
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  /**
   * Gère le retry en cas d'erreur
   */
  retry(): void {
    this.loadFormations(0);
  }

  /**
   * Vérifie si une formation a une image valide
   * @param formation - Formation à vérifier
   */
  hasValidImage(formation: FormationListDto): boolean {
    return !!(formation.photoPrincipale && formation.photoPrincipale.trim());
  }

  /**
   * Retourne une image par défaut si l'image principale n'existe pas
   * @param formation - Formation concernée
   */
  getFormationImage(formation: FormationListDto): string {
    if (this.hasValidImage(formation)) {
      return formation.photoPrincipale!;
    }
    return '/assets/images/formation-default.jpg'; // Image par défaut
  }

  /**
   * Format le prix pour l'affichage
   * @param prix - Prix à formatter
   */
  formatPrice(prix: number): string {
  if (!prix) return 'Sur devis';

  // Format le nombre avec des espaces comme séparateurs de milliers
  const formattedNumber = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(prix);

  return `${formattedNumber} FCFA`;
}

  /**
   * Retourne une description tronquée
   * @param description - Description à tronquer
   * @param maxLength - Longueur maximale
   */
  getTruncatedDescription(description: string, maxLength: number = 120): string {
    if (!description) return '';

    if (description.length <= maxLength) return description;

    return description.substring(0, maxLength).trim() + '...';
  }

  /**
   * Vérifie si la pagination est nécessaire
   */
  get shouldShowPagination(): boolean {
    return this.totalPages > 1 && !this.isLoading && !this.errorMessage;
  }

  /**
   * Retourne le nombre total de formations formaté
   */
  get formattedTotalElements(): string {
    if (this.totalElements === 0) return 'Aucune formation';
    if (this.totalElements === 1) return '1 formation';
    return `${this.totalElements} formations`;
  }


  searchFormations(page: number = 0): void {
  this.isLoading = true;
  this.errorMessage = null;
  this.currentPage = page;

  // Si la recherche est vide, charger toutes les formations
  if (!this.searchQuery || this.searchQuery.trim().length === 0) {
    this.loadFormations(page);
    return;
  }

  this.formationService.searchFormations(
    this.searchQuery.trim(),
    page,
    this.searchPageSize
  )
  .pipe(
    takeUntil(this.destroy$),
    debounceTime(300)
  )
  .subscribe({
    next: (response: ApiResponse<any>) => {
      this.handleSuccessResponse(response);
    },
    error: (err) => {
      this.handleErrorResponse(err);
    }
  });
}

// Soumission du formulaire
onSearchSubmit(event: Event): void {
  event.preventDefault();
  this.searchFormations(0);
}

// Pour la pagination (méthode corrigée)
onPageChange(page: number): void {
  if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.searchFormations(page);
    } else {
      this.loadFormations(page);
    }
  }
}

// Nouvelle méthode pour réinitialiser la recherche
clearSearch(): void {
  this.searchQuery = '';
  this.loadFormations(0);
}

// Méthode pour la recherche en temps réel (optionnel)
onSearchInput(): void {
  // Recherche automatique après 500ms d'inactivité
  if (this.searchTimeout) {
    clearTimeout(this.searchTimeout);
  }

  this.searchTimeout = setTimeout(() => {
    this.searchFormations(0);
  }, 500);
}

// N'oubliez pas d'ajouter cette propriété en haut de la classe
private searchTimeout: any;

getAnimationDelay(index: number): string {
  return `${index * 0.1}s`;
}

}
