import { Component, inject, OnInit } from '@angular/core';
import { FormationService } from '../../shared/services/formation.service';
import { Router } from '@angular/router';
import { FormationAdminDto } from '../../shared/dtos/FormationAdminDto';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formation-admin-list',
  standalone: true,
  imports: [DecimalPipe, CommonModule, FormsModule],
  templateUrl: './formation-admin-list.component.html',
  styleUrl: './formation-admin-list.component.scss'
})
export class FormationAdminListComponent implements OnInit {
  formations: FormationAdminDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  pageSize = 20;
  pageNumber = 0;
  totalPages = 1;
  totalElements = 0;

  searchQuery: string = '';
  showInactiveOnly: boolean = false;

  constructor() {}

  private readonly formationService = inject  ( FormationService);
  private readonly router = inject  (Router);

  scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
  ngOnInit(): void {
    this.loadFormations();
  }



  loadFormations(page: number = 0) {
    this.isLoading = true;
    this.formationService.getAdminFormations(page, this.pageSize).subscribe({
      next: (response) => {
        const pageData = response.data;

        if (pageData) {
          let formations = pageData.content || [];
          // Filtre par recherche
          if (this.searchQuery.trim().length > 0) {
            const query = this.searchQuery.toLowerCase();
            formations = formations.filter(f =>
              (f.nom && f.nom.toLowerCase().includes(query)) ||
              (f.categorie && f.categorie.toLowerCase().includes(query))
            );
          }
          // Filtre pour inactifs (désactivés)
          if (this.showInactiveOnly) {
            formations = formations.filter(f => !f.active);
          }
          this.formations = formations;
          this.pageSize = pageData.size || 20;
          this.pageNumber = pageData.number || 0;
          this.totalPages = pageData.totalPages || 1;
          this.totalElements = pageData.totalElements || formations.length;
        } else {
          this.formations = [];
          this.pageSize = 20;
          this.pageNumber = 0;
          this.totalPages = 1;
          this.totalElements = 0;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement formations:', err);
        this.errorMessage = 'Erreur lors du chargement des formations.';
        this.formations = [];
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number) {
  if (page >= 0 && page < this.totalPages) {
    this.loadFormations(page);
    this.scrollToTop();
  }
}



  editFormation(id: number) {
    this.router.navigate(['/admin/formations/edit', id]);
  }

  deleteFormation(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      this.formationService.deleteFormation(id).subscribe({
        next: () => this.loadFormations(this.pageNumber),
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }

  // Recherche
  onSearchInput(): void {
  this.loadFormations(0);
  this.scrollToTop();
}

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.loadFormations(0);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadFormations(0);
  }

  // Filtre inactifs
  toggleShowInactive() {
    this.showInactiveOnly = !this.showInactiveOnly;
    this.loadFormations(0);
  }

  // Réactivation d'une formation (active = true)
  reactivateFormation(id: number) {
    this.isLoading = true;
    this.formationService.updateFormation(id, { active: true }, 'admin').subscribe({
      next: () => this.loadFormations(this.pageNumber),
      error: () => {
        this.errorMessage = 'Erreur lors de la réactivation.';
        this.isLoading = false;
      }
    });
  }

  goToCreation() {
  this.router.navigate(['/creation']);

}
}
