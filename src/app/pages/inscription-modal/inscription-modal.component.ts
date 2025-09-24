import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormationDetailDto } from '../../shared/dtos/formation-detail-dto.model';
import { MessageService } from '../../shared/services/message.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription-modal',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './inscription-modal.component.html',
  styleUrls: ['./inscription-modal.component.scss']
})
export class InscriptionModalComponent {
  @Input() formation!: FormationDetailDto;
  @Output() close = new EventEmitter<void>();

  inscriptionForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  private readonly messageService = inject (MessageService);
  private readonly fb = inject(FormBuilder) ;

  constructor( ) {
    this.inscriptionForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      ville: [''],
      disponibilites: [''],
      message: ['', Validators.required],
    });
  }

  submit() {
    if (this.inscriptionForm.invalid) return;
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const dto = {
      ...this.inscriptionForm.value,
      formationId: this.formation.id,
      sourceVisite: 'site',
      adresseIP: '', // à calculer ou passer depuis backend
      userAgent: window.navigator.userAgent,
    };
    this.messageService.preInscription(dto).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = "Votre pré-inscription a bien été enregistrée !";
        this.inscriptionForm.reset();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = "Erreur lors de l'inscription. Essayez à nouveau.";
      }
    });
  }
}
