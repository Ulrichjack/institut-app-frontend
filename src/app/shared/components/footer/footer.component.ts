import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  newsletterForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  private readonly fb = inject(FormBuilder);
  private readonly newsletterService = inject(MessageService);

  constructor() {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nom: [''] // Optionnel
    });
  }

  subscribeNewsletter() {
    const dto = this.newsletterForm.value;
    this.successMessage = '';
    this.errorMessage = '';

    this.newsletterService.subscribe(dto).subscribe({
      next: (msg) => {
        this.successMessage = msg;
        this.newsletterForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error || "Erreur lors de l'inscription. Réessayez.";
      }
    });
  }
}
