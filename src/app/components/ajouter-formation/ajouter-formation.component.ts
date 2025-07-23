// src/app/components/ajouter-formation/ajouter-formation.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Formation } from '../../models/formation.model';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ajouter-formation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajouter-formation.component.html',
  styleUrls: ['./ajouter-formation.component.css']
})
export class AjouterFormationComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() formationAdded = new EventEmitter<Formation | null>();

  formationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.formationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      duree: ['', [Validators.required, Validators.min(1)]],
      planifiee: [false]
    });
  }

  onSubmit(): void {
    if (this.formationForm.valid) {
      const newFormation: Formation = {
        ...this.formationForm.value,
        id: 0,
        statut: this.formationForm.value.planifiee ? 'planifiee' : 'en_cours'
      };

      this.apiService.createFormation(newFormation).subscribe({
        next: (formation) => {
          this.toastr.success('Formation enregistrée !');
          this.apiService.addFormationToList(formation); // 🔁 mise à jour auto
          this.formationAdded.emit(formation);
          this.close();
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          this.toastr.error(`Erreur technique: ${error.statusText || 'Service indisponible'}`);
        }
      });
    }
  }

  close(): void {
    this.closeModal.emit();
    this.formationForm.reset({ planifiee: false });
  }
}
