import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-creer-demande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-demande.component.html',
  styleUrls: ['./creer-demande.component.css']
})
export class CreerDemandeComponent implements OnInit {
  nouvelleDemande = {
    email_collaborateur: '',
    nom_collaborateur: '',
    formation_id: 0,
    formation_titre: '',
    statut: 'EN_ATTENTE'
  };

  formations: any[] = [];
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de formation depuis l'URL si présent
    const formationId = this.route.snapshot.params['id'];
    if (formationId) {
      this.apiService.getFormationForDemande(formationId).subscribe({
        next: (data: any) => {
          this.nouvelleDemande.formation_id = data.formationId;
          this.nouvelleDemande.formation_titre = data.formationTitre;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = 'Erreur lors du chargement de la formation';
        }
      });
    }

    // Charger toutes les formations pour la liste déroulante
    this.apiService.getFormations().subscribe({
      next: (data: any) => {
        this.formations = data;
      },
      error: (err) => {
        console.error('Erreur:', err);
      }
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.createDemande(this.nouvelleDemande).subscribe({
      next: () => {
        this.successMessage = 'Demande créée avec succès!';
        setTimeout(() => this.router.navigate(['/demandes']), 2000);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors de la création de la demande';
        this.isSubmitting = false;
      },
      complete: () => this.isSubmitting = false
    });
  }
}