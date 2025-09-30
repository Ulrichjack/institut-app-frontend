import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../shared/services/formation.service';
import { ApiResponse } from '../../shared/dtos/api-response.model';
import { FormationCreateDto } from '../../shared/dtos/formation-create-dto.model';
import { FormationUpdateDto } from '../../shared/dtos/FormationUpdateDto';

@Component({
  selector: 'app-formation-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './formation-creation.component.html',
  styleUrl: './formation-creation.component.scss'
})
export class FormationCreationComponent implements OnInit {
  @ViewChild('topContainer', { static: true }) topContainer!: ElementRef;

  formationForm!: FormGroup;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  activeSection: 'advanced' | 'media' | 'seo' | null = null;

  galleryFiles: File[] = [];
  galleryImagePreviews: string[] = [];

  isImageUploading: boolean = false;
  isGalleryUploading: boolean = false;

  // Édition
  isEditMode: boolean = false;
  editId: number | null = null;
  private readonly adminCreateur: string = 'admin';

  private readonly fb = inject(FormBuilder);
  private readonly formationService = inject(FormationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.editId = +idParam;
        this.loadFormationForEdit(this.editId);
      }
    });
  }

  private initForm(): void {
    this.formationForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      duree: ['', Validators.required],
      fraisInscription: [null, [Validators.required, Validators.min(0.01)]],
      prix: [null, [Validators.required, Validators.min(0.01)]],
      categorie: ['', Validators.required],
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
      photoPrincipale: [''],
      photosGalerie: [''],
      videoPresentation: [''],
      enPromotion: [false],
      pourcentageReduction: [0],
      dateDebutPromo: [null],
      dateFinPromo: [null],
      metaTitle: [''],
      metaDescription: [''],
      slug: [''],
      active: [true]
    });
  }

  private loadFormationForEdit(id: number) {
    this.isLoading = true;
    this.formationService.getFormationById(id).subscribe({
      next: (response) => {
        const data = response.data;
        if (data) {
          this.formationForm.patchValue({
            ...data,
            photosGalerie: data.photosGalerie ?? [],
            photoPrincipale: data.photoPrincipale ?? ''
          });
          this.imagePreview = data.photoPrincipale ?? null;
          this.galleryImagePreviews = data.photosGalerie ?? [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger la formation à modifier.";
        this.isLoading = false;
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      this.scrollToTop();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    try {
      // Upload image principale si sélectionnée
      if (this.selectedFile) {
        this.isImageUploading = true;
        const imageUrl = await this.uploadToCloudinary(this.selectedFile);
        this.formationForm.patchValue({ photoPrincipale: imageUrl });
        this.imagePreview = imageUrl;
        this.isImageUploading = false;
      }

      // Upload images galerie
      const galleryUrls: string[] = [];
      if (this.galleryFiles.length > 0) {
        this.isGalleryUploading = true;
        for (let i = 0; i < this.galleryFiles.length; i++) {
          const file = this.galleryFiles[i];
          const url = await this.uploadToCloudinary(file);
          galleryUrls.push(url);
        }
        this.isGalleryUploading = false;
      }

      const formData = this.formationForm.value;
      formData.photosGalerie = galleryUrls.length > 0 ? galleryUrls : this.galleryImagePreviews;

      if (this.isEditMode && this.editId) {
        // MODIFICATION
        this.formationService.updateFormation(this.editId, formData as FormationUpdateDto, this.adminCreateur).subscribe({
          next: (response: ApiResponse<any>) => {
            this.isLoading = false;
            if (response.success) {
              this.successMessage = response.message || 'Formation modifiée avec succès !';
            } else {
              this.errorMessage = response.message || 'Erreur lors de la modification.';
            }
            this.scrollToTop();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Erreur de communication avec le serveur.';
            this.scrollToTop();
          }
        });
      } else {
        // CRÉATION
        this.formationService.createFormation(formData as FormationCreateDto, this.adminCreateur).subscribe({
          next: (response: ApiResponse<any>) => {
            this.isLoading = false;
            if (response.success) {
              this.successMessage = response.message || 'Formation créée avec succès !';
              this.resetForm();
            } else {
              this.errorMessage = response.message || 'Erreur lors de la création de la formation.';
            }
            this.scrollToTop();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Erreur de communication avec le serveur.';
            this.scrollToTop();
          }
        });
      }
    } catch (err) {
      this.isLoading = false;
      this.isImageUploading = false;
      this.isGalleryUploading = false;
      this.errorMessage = "Erreur lors de l'upload des images.";
      this.scrollToTop();
    }
  }

  private resetForm(): void {
    this.formationForm.reset({
      certificatDelivre: true,
      socialProofActif: false,
      nombrePlaces: 15,
      nombreInscritsAffiche: 0,
      photosGalerie: '',
      enPromotion: false,
      pourcentageReduction: 0,
      active: true
    });
    this.selectedFile = null;
    this.imagePreview = null;
    this.galleryFiles = [];
    this.galleryImagePreviews = [];
    this.activeSection = null;
    this.isEditMode = false;
    this.editId = null;
  }

  private scrollToTop(): void {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      if (this.selectedFile.size > 5 * 1024 * 1024) {
        this.errorMessage = 'L\'image principale ne peut pas dépasser 5MB.';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      const MAX_IMAGES = 10;
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      const oversizedFiles = filesArray.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        this.errorMessage = `Certaines images dépassent 5MB. Veuillez sélectionner des images plus petites.`;
        return;
      }
      if (filesArray.length > MAX_IMAGES) {
        this.errorMessage = `Tu ne peux sélectionner que ${MAX_IMAGES} images maximum pour la galerie.`;
        this.galleryFiles = filesArray.slice(0, MAX_IMAGES);
      } else {
        this.errorMessage = null;
        this.galleryFiles = filesArray;
      }
      this.galleryImagePreviews = [];
      this.galleryFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.galleryImagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeGalleryImage(index: number): void {
    this.galleryFiles.splice(index, 1);
    this.galleryImagePreviews.splice(index, 1);
  }

  async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'institue');
    const res = await fetch('https://api.cloudinary.com/v1_1/dfurjzy3b/image/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      throw new Error(`Erreur Cloudinary: ${res.status}`);
    }
    const data = await res.json();
    if (!data.secure_url) {
      throw new Error('URL manquante dans la réponse Cloudinary');
    }
    return data.secure_url;
  }

  openSection(section: 'advanced' | 'media' | 'seo') {
    this.activeSection = (this.activeSection === section) ? null : section;
  }

  getFieldErrorClass(fieldName: string): string {
    const field = this.formationForm.get(fieldName);
    return field && field.invalid && field.touched ? 'is-invalid' : '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.formationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
