import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
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

  // Animation states
  isImageUploading: boolean = false;
  isGalleryUploading: boolean = false;

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
      photosGalerie: [''], // CHANGEMENT: String simple au lieu de FormArray
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
      this.scrollToTop();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    try {
      // ÉTAPE 1: Upload image principale si sélectionnée
      if (this.selectedFile) {
        console.log('Upload image principale...');
        this.isImageUploading = true;
        const imageUrl = await this.uploadToCloudinary(this.selectedFile);
        console.log('Image principale uploadée:', imageUrl);
        this.formationForm.patchValue({ photoPrincipale: imageUrl });
        this.isImageUploading = false;
      }

      // ÉTAPE 2: Upload images galerie
      const galleryUrls: string[] = [];
      if (this.galleryFiles.length > 0) {
        console.log('Upload galerie...', this.galleryFiles.length, 'images');
        this.isGalleryUploading = true;

        for (let i = 0; i < this.galleryFiles.length; i++) {
          const file = this.galleryFiles[i];
          console.log(`Upload image ${i + 1}/${this.galleryFiles.length}`);
          const url = await this.uploadToCloudinary(file);
          console.log(`Image ${i + 1} uploadée:`, url);
          galleryUrls.push(url);
        }

        this.isGalleryUploading = false;
        console.log('Toutes les images uploadées:', galleryUrls);
      }

      // ÉTAPE 3: Préparer les données pour le backend
      const formData = this.formationForm.value;

      // CORRECTION CRITIQUE: Assigner le tableau d'URLs au lieu d'une chaîne vide
      formData.photosGalerie = galleryUrls;

      console.log('Données à envoyer au backend:', formData);
      console.log('Photos galerie final:', formData.photosGalerie);

      // ÉTAPE 4: Envoyer au backend
      this.formationService.createFormation(formData as FormationCreateDto, this.adminCreateur).subscribe({
        next: (response: ApiResponse<any>) => {
          this.isLoading = false;
          console.log('Réponse backend:', response);

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
          console.error('Erreur backend:', err);
          this.scrollToTop();
        }
      });

    } catch (err) {
      this.isLoading = false;
      this.isImageUploading = false;
      this.isGalleryUploading = false;
      this.errorMessage = "Erreur lors de l'upload des images.";
      console.error('Erreur upload:', err);
      this.scrollToTop();
    }
  }

  private resetForm(): void {
    this.formationForm.reset({
      certificatDelivre: true,
      socialProofActif: false,
      nombrePlaces: 15,
      nombreInscritsAffiche: 0,
      photosGalerie: '', // Reset à string vide
      enPromotion: false,
      pourcentageReduction: 0,
      active: true
    });
    this.selectedFile = null;
    this.imagePreview = null;
    this.galleryFiles = [];
    this.galleryImagePreviews = [];
    this.activeSection = null;
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

      // Validation de la taille du fichier (max 5MB)
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
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

      // Validation des tailles de fichiers
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

      // Générer les aperçus
      this.galleryImagePreviews = [];
      this.galleryFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.galleryImagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });

      console.log('Fichiers galerie sélectionnés:', this.galleryFiles.length);
    }
  }

  removeGalleryImage(index: number): void {
    this.galleryFiles.splice(index, 1);
    this.galleryImagePreviews.splice(index, 1);
    console.log('Image supprimée, restantes:', this.galleryFiles.length);
  }

  async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'institue');

    console.log('Upload vers Cloudinary:', file.name);

    const res = await fetch('https://api.cloudinary.com/v1_1/dfurjzy3b/image/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('Erreur Cloudinary:', res.status, errorData);
      throw new Error(`Erreur Cloudinary: ${res.status}`);
    }

    const data = await res.json();
    console.log('Réponse Cloudinary:', data);

    if (!data.secure_url) {
      console.error('Pas de secure_url dans la réponse:', data);
      throw new Error('URL manquante dans la réponse Cloudinary');
    }

    return data.secure_url;
  }

  openSection(section: 'advanced' | 'media' | 'seo') {
    this.activeSection = (this.activeSection === section) ? null : section;
  }

  // Helpers pour les classes CSS
  getFieldErrorClass(fieldName: string): string {
    const field = this.formationForm.get(fieldName);
    return field && field.invalid && field.touched ? 'is-invalid' : '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.formationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
