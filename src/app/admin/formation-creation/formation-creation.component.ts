import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormationService } from '../../shared/services/formation.service';
import { ApiResponse } from '../../shared/dtos/api-response.model';
import { FormationCreateDto } from '../../shared/dtos/formation-create-dto.model';

@Component({
  selector: 'app-formation-creation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formation-creation.component.html',
  styleUrl: './formation-creation.component.scss'
})
export class FormationCreationComponent implements OnInit {
  formationForm!: FormGroup;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  activeSection: 'advanced' | 'media' | 'seo' | null = null;


  // Pour les sections dépliables
  showAdvanced: boolean = false;
  showMedia: boolean = false;
  showSEO: boolean = false;

  private readonly adminCreateur: string = 'admin';
  private readonly fb = inject(FormBuilder);
  private readonly formationService = inject(FormationService);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.formationForm = this.fb.group({
      // Champs essentiels
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      duree: ['', Validators.required],
      fraisInscription: [null, [Validators.required, Validators.min(0.01)]],
      prix: [null, [Validators.required, Validators.min(0.01)]],
      categorie: ['', Validators.required],
      // Optionnel/avancé
      certificatDelivre: [true],
      nomCertificat: [''],
      programme: [''],
      objectifs: [''],
      materielFourni: [''],
      horaires: [''],
      frequence: [''],
      nombrePlaces: [15, [Validators.min(1)]],
      nombreInscritsAffiche: [0, [Validators.min(0)]],
      socialProofActif: [false],
      // Médias
      photoPrincipale: [''],
      photosGalerie: this.fb.array([]),
      videoPresentation: [''],
      // Promotion
      enPromotion: [false],
      pourcentageReduction: [0],
      dateDebutPromo: [null],
      dateFinPromo: [null],
      // SEO
      metaTitle: [''],
      metaDescription: [''],
      slug: [''],
      active: [true]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    // Upload image sur Cloudinary si sélectionnée
    if (this.selectedFile) {
      try {
        const imageUrl = await this.uploadToCloudinary(this.selectedFile);
        this.formationForm.patchValue({ photoPrincipale: imageUrl });
      } catch (err) {
        this.isLoading = false;
        this.errorMessage = "Erreur lors de l'upload de l'image.";
        return;
      }
    }

    // Envoi au backend
    const formationData: FormationCreateDto = this.formationForm.value;
    console.log('Payload envoyé:', this.formationForm.value);
    this.formationService.createFormation(formationData, this.adminCreateur).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message || 'Formation créée avec succès !';
          this.formationForm.reset({
            certificatDelivre: true,
            socialProofActif: false,
            nombrePlaces: 15,
            nombreInscritsAffiche: 0,
            photosGalerie: [],
            enPromotion: false,
            pourcentageReduction: 0
          });
          this.selectedFile = null;
          this.imagePreview = null;
        } else {
          this.errorMessage = response.message || 'Erreur lors de la création de la formation.';
        }
        window.scrollTo(0, 0);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur de communication avec le serveur.';
        console.error(err);
        window.scrollTo(0, 0);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'institue'); // Ton preset Cloudinary
    const res = await fetch('https://api.cloudinary.com/v1_1/dfurjzy3b/image/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.secure_url;
  }

openSection(section: 'advanced' | 'media' | 'seo') {
  this.activeSection = (this.activeSection === section) ? null : section;
}


}
