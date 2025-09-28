import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imagePreview: string | null = null; // Aperçu local

  private readonly fb = inject(FormBuilder);
  private readonly galleryService = inject(GalleryService);
  private readonly formationService = inject(FormationService);

  ngOnInit(): void {
    this.initForm();
    this.loadFormations();
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
  // Appelle ton service qui retourne la liste simplifiée des formations
  // Exemple avec FormationService
  this.formationService.getFormationsForSelection().subscribe({
    next: (res) => {
      this.formations = res.data || [];
    }
  });
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Aperçu local seulement
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.imageForm.invalid || !this.selectedFile) {
      this.imageForm.markAllAsTouched();
      this.errorMessage = 'Complète tous les champs et sélectionne une image.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    try {
      // 1. Upload sur Cloudinary (seulement maintenant)
    const { url, filename } = await this.uploadToCloudinary(this.selectedFile);
    const payload = {
      ...this.imageForm.value,
     url,
     filename
   };

      // 3. Envoyer au backend
      this.galleryService.addImage(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Image ajoutée à la galerie !';
          this.imageForm.reset({ isPublic: true, categorie: 'EVENEMENT', formationId: null });
          this.selectedFile = null;
          this.imagePreview = null;
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la création côté serveur.';
        }
      });
    } catch (err) {
      this.isLoading = false;
      this.errorMessage = "Erreur lors de l'upload sur Cloudinary.";
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
  const data = await res.json();
  return { url: data.secure_url, filename: data.public_id }; // public_id est le nom Cloudinary
}
}
