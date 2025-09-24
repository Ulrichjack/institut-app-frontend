import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../shared/services/message.service';
import { FormationDetailDto } from '../../shared/dtos/formation-detail-dto.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-modal',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent {
  @Input() formation?: FormationDetailDto; // Passe la formation entière pour id/slug/nom
  @Output() close = new EventEmitter<void>();

  contactForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.contactForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^[+]?[0-9\s\-\(\)]{8,15}$/)]],
      ville: ['', Validators.maxLength(50)],
      sujet: ['', Validators.maxLength(100)],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    });
  }

  // Validation visuelle pour chaque champ
  getFieldError(field: string): string | null {
    const control = this.contactForm.get(field);
    if (!control || control.valid || !control.touched) return null;
    if (control.errors?.['required']) return 'Ce champ est obligatoire';
    if (control.errors?.['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    if (control.errors?.['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    if (field === 'email' && control.errors?.['email']) return 'Email invalide';
    if (field === 'telephone' && control.errors?.['pattern']) return 'Téléphone invalide';
    return 'Champ invalide';
  }

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const dto = {
      ...this.contactForm.value,
      formationNom: this.formation?.nom || '',
      formationId: this.formation?.id || null,
      sourceVisite: 'site',
      adresseIP: '', // à gérer côté backend ou via api externe
      userAgent: window.navigator.userAgent,
    };
    this.messageService.contact(dto).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = "Votre message a bien été envoyé !";
        this.contactForm.reset();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = "Erreur lors de l'envoi. Essayez à nouveau.";
      }
    });
  }
}
