import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../../shared/services/gallery.service';
import { FormationService } from '../../shared/services/formation.service';

@Component({
  selector: 'app-gallery-image-creation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gallery-image-creation.component.html',
  styleUrl: './gallery-image-creation.component.scss'
})
export class GalleryImageCreationComponent implements OnInit {
  imageForm!: FormGroup;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  formations: { id: number, nom: string }[] = [];

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  currentImageUrl: string | null = null; // URL de l'image existante

  isEditMode: boolean = false;
  editId: number | null = null;

  private readonly fb = inject(FormBuilder);
  private readonly galleryService = inject(GalleryService);
  private readonly formationService = inject(FormationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.initForm();
    this.loadFormations();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.editId = +idParam;
        this.loadImageForEdit(this.editId);
      }
    });
  }

  private initForm(): void {
    this.imageForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      categorie: ['EVENEMENT', Validators.required],
      isPublic: [true],
      formationId: [null]
    });
  }

  loadFormations(): void {
    this.formationService.getFormationsForSelection().subscribe({
      next: (res) => {
        this.formations = res.data || [];
      }
    });
  }

  loadImageForEdit(id: number): void {
    this.isLoading = true;
    // Utilisation de getImageById au lieu de getImagesPaged
    this.galleryService.getImageById(id).subscribe({
      next: (img) => {
        this.imageForm.patchValue({
          titre: img.titre,
          description: img.description,
          categorie: img.categorie,
          isPublic: img.isPublic,
          formationId: img.formation?.id ?? null
        });
        // Stocker l'URL actuelle et l'afficher en aperçu
        this.currentImageUrl = img.url;
        this.imagePreview = img.url;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger l'image à modifier.";
        this.isLoading = false;
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

  async onSubmit(): Promise<void> {
    if (this.imageForm.invalid) {
      this.imageForm.markAllAsTouched();
      this.errorMessage = 'Complète tous les champs.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    let url = this.currentImageUrl || ''; // Utiliser l'URL existante par défaut
    let filename = '';

    // Uploader uniquement si un nouveau fichier a été sélectionné
    if (this.selectedFile) {
      try {
        const upload = await this.uploadToCloudinary(this.selectedFile);
        url = upload.url;
        filename = upload.filename;
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de l\'upload de l\'image.';
        return;
      }
    }

    const payload = {
      ...this.imageForm.value,
      url,
      filename
    };

    if (this.isEditMode && this.editId) {
      this.galleryService.updateImage(this.editId, payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Image modifiée avec succès !';
          // Rediriger vers la liste après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/admin/gallery-list']);
          }, 2000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la modification: ' + (err.error?.message || 'Erreur serveur');
          console.error('Erreur modification:', err);
        }
      });
    } else {
      // Mode création - vérifier qu'un fichier est sélectionné
      if (!this.selectedFile) {
        this.isLoading = false;
        this.errorMessage = 'Veuillez sélectionner une image.';
        return;
      }

      this.galleryService.addImage(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Image ajoutée à la galerie !';
          this.imageForm.reset({ isPublic: true, categorie: 'EVENEMENT', formationId: null });
          this.selectedFile = null;
          this.imagePreview = null;
          this.currentImageUrl = null;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la création: ' + (err.error?.message || 'Erreur serveur');
          console.error('Erreur création:', err);
        }
      });
    }
  }

  async uploadToCloudinary(file: File): Promise<{url: string, filename: string}> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'institue');

    const res = await fetch('https://api.cloudinary.com/v1_1/dfurjzy3b/image/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error('Erreur upload Cloudinary');
    }

    const data = await res.json();
    return { url: data.secure_url, filename: data.public_id };
  }
}
