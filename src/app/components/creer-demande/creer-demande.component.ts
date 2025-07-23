import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Demande } from '../../models/demande.model';
import { Formation } from '../../models/formation.model';

@Component({
  selector: 'app-creer-demande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-demande.component.html',
  styleUrls: ['./creer-demande.component.css']
})
export class CreerDemandeComponent implements OnInit {
  nouvelleDemande: Demande = {
    id_demande: undefined,
    email_collaborateur: '',
    nom_collaborateur: '',
    formation_id: 0,
    statut: 'EN_ATTENTE',
    date_demande: undefined
  };

  formations: Formation[] = [];
  selectedFormation: Formation | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  isLoading = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.isLoading = true;
    this.apiService.getFormations().subscribe({
      next: (data: Formation[]) => {
        this.formations = data;
        this.isLoading = false;
        this.checkRouteForFormation();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des formations';
        this.isLoading = false;
      }
    });
  }

  checkRouteForFormation(): void {
    const formationId = Number(this.route.snapshot.params['id']);
    if (!isNaN(formationId) && formationId > 0) {
      this.nouvelleDemande.formation_id = formationId;
      this.onFormationChange();
    }
  }

  onFormationChange(): void {
    this.selectedFormation = this.formations.find(
      f => f.id === this.nouvelleDemande.formation_id
    ) || null;
    
    if (this.selectedFormation) {
      this.checkFormationDisponible();
    }
  }

  checkFormationDisponible(): void {
    if (this.nouvelleDemande.formation_id) {
      this.apiService.checkFormationDisponible(this.nouvelleDemande.formation_id)
        .subscribe({
          next: (disponible) => {
            if (!disponible) {
              this.errorMessage = 'Cette formation n\'est pas disponible actuellement';
              this.nouvelleDemande.formation_id = 0;
              this.selectedFormation = null;
            }
          },
          error: (err) => {
            console.error('Erreur de vérification:', err);
          }
        });
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;

    this.apiService.createDemande(this.nouvelleDemande).subscribe({
      next: (response) => {
        this.successMessage = `Demande créée pour "${this.selectedFormation?.titre}"`;
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/demandes']), 2000);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = this.getErrorMessage(err);
        this.isSubmitting = false;
      }
    });
  }

  private isFormValid(): boolean {
    if (!this.nouvelleDemande.nom_collaborateur?.trim()) {
      this.errorMessage = 'Le nom complet est obligatoire';
      return false;
    }

    if (!this.nouvelleDemande.email_collaborateur?.trim()) {
      this.errorMessage = 'L\'email professionnel est obligatoire';
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.nouvelleDemande.email_collaborateur)) {
      this.errorMessage = 'Veuillez entrer un email valide';
      return false;
    }

    if (!this.nouvelleDemande.formation_id) {
      this.errorMessage = 'Veuillez sélectionner une formation';
      return false;
    }

    return true;
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Une erreur est survenue lors de la création de la demande';
  }

  getSelectedFormationTitle(): string {
    return this.selectedFormation?.titre || 'Aucune formation sélectionnée';
  }
}