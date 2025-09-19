import { Component, OnInit } from '@angular/core';
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
export class HomeFormationsComponent implements OnInit {

  formations: FormationListDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private formationService: FormationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Charge les 3 dernières formations au démarrage
    this.loadLatestFormations();
  }

  loadLatestFormations(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // J'ai mis 0 pour la première page et 3 pour la taille
    this.formationService.getFormationsList(0, 6).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.formations = response.data.content;
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
  if (!url) return 'assets/images/default-image.jpg'; // ou une autre image par défaut
  return url.replace('/upload/', '/upload/w_600,h_400,c_fill,q_auto/');
}
}

