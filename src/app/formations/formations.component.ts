import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormationListDto } from '../shared/dtos/formation-list-dto.model';
import { FormationService } from '../shared/services/formation.service';
import { ApiResponse } from '../shared/dtos/api-response.model';
import { FormsModule } from '@angular/forms'; // Nécessaire si vous utilisez des formulaires

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FormationsComponent implements OnInit {

  formations: FormationListDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  // Propriétés pour la pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  constructor(
    private formationService: FormationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Charge la première page de formations au démarrage
    this.loadFormations();
  }

  loadFormations(page: number = this.currentPage): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.currentPage = page;

    this.formationService.getFormationsList(page, this.pageSize).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.formations = response.data.content;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;
        } else {
          this.errorMessage = response.message || 'Aucune formation trouvée.';
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

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadFormations(page);
    }
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }
}
