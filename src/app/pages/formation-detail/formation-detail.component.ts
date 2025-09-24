import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationListDto } from '../../shared/dtos/formation-list-dto.model';
import { FormationService } from '../../shared/services/formation.service';
import { ApiResponse } from '../../shared/dtos/api-response.model';
import { CommonModule } from '@angular/common';
import { FormationDetailDto } from '../../shared/dtos/formation-detail-dto.model';
import { InscriptionModalComponent } from "../inscription-modal/inscription-modal.component";
import { ContactModalComponent } from "../contact-modal/contact-modal.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-formation-detail',
  imports: [CommonModule, InscriptionModalComponent, ContactModalComponent],
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.scss']
})
export class FormationDetailComponent implements OnInit {
  formation?: FormationDetailDto;
  autresFormations: FormationListDto[] = [];
  showInscriptionModal = false;
  showContactModal = false;
  isLoading = false;
  errorMessage: string | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly  formationService = inject(FormationService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadFormation(slug);
        this.loadAutresFormations(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top
      }
    });
    // Initialiser les onglets Bootstrap après le chargement du composant
    this.initializeBootstrapTabs();
  }

  loadFormation(slug: string): void {
    this.isLoading = true;
    this.formationService.getFormationDetailBySlug(slug).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.formation = response.data;
        } else {
          this.errorMessage = response.message || 'Formation non trouvée.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement de la formation.';
        console.error(err);
      }
    });
  }

loadAutresFormations(slug: string): void {
  this.formationService.getFormationsList(0, 100).subscribe({
    next: (response: ApiResponse<any>) => {
      if (response.success && response.data) {
        let allFormations = response.data.content.filter((f: any) => f.slug !== slug);
        // Mélanger et prendre 3 au hasard
        this.autresFormations = allFormations
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      } else {
        this.autresFormations = [];
      }
    },
    error: (err) => {
      this.autresFormations = [];
      console.error(err);
    }
  });
}

  private initializeBootstrapTabs(): void {
    // Attendre que le DOM soit rendu
    setTimeout(() => {
      const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          this.showTab(tab as HTMLElement);
        });
      });
    }, 100);
  }

  private showTab(tabElement: HTMLElement): void {
    // Retirer la classe active de tous les onglets et contenus
    const allTabs = document.querySelectorAll('.nav-link');
    const allContents = document.querySelectorAll('.tab-pane');

    allTabs.forEach(tab => tab.classList.remove('active'));
    allContents.forEach(content => {
      content.classList.remove('show', 'active');
    });

    // Ajouter la classe active à l'onglet cliqué
    tabElement.classList.add('active');

    // Afficher le contenu correspondant
    const targetId = tabElement.getAttribute('data-bs-target');
    if (targetId) {
      const targetContent = document.querySelector(targetId);
      if (targetContent) {
        targetContent.classList.add('show', 'active');
      }
    }
  }

  openInscriptionModal(): void {
    this.showInscriptionModal = true;
  }

  closeInscriptionModal(): void {
    this.showInscriptionModal = false;
  }

  openContactModal(): void {
    this.showContactModal = true;
  }

  closeContactModal(): void {
    this.showContactModal = false;
  }

  voirDetails(id: number): void {
    // Utiliser le slug si disponible, sinon l'ID
    const formation = this.autresFormations.find(f => f.id === id);
    if (formation && formation.slug) {
      this.router.navigate(['/formations', formation.slug]);
    } else {
      this.router.navigate(['/formations', id]);
    }
  }

  // Méthodes utilitaires pour le template
  get formationCompleteMessage(): string {
    if (this.formation?.formationComplete) {
      return 'Formation complète';
    }
    return `${this.formation?.placesRestantes} places restantes`;
  }

  get promoValidMessage(): string {
    if (this.formation?.dateFinPromo) {
      const dateFinPromo = new Date(this.formation.dateFinPromo);
      const now = new Date();
      const diffTime = dateFinPromo.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        return `Plus que ${diffDays} jour${diffDays > 1 ? 's' : ''} pour profiter de cette offre !`;
      }
    }
    return 'Promotion limitée dans le temps !';
  }

  // Dans votre composant
formatPrice(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

retour() {
  // Retour navigateur, ou remplace par : this.router.navigate(['/formations']);
  this.location.back();
}

}
