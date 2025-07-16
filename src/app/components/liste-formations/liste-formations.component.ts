import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Formation } from '../../models/formation.model';
import { ApiService } from '../../services/api.service';
import { AjouterFormationComponent } from '../ajouter-formation/ajouter-formation.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';

@Component({
  selector: 'app-liste-formations',
  standalone: true,
  imports: [CommonModule, AjouterFormationComponent, TruncatePipe, RouterLink],
  templateUrl: './liste-formations.component.html',
  styleUrls: ['./liste-formations.component.css']
})
export class ListeFormationsComponent implements OnInit {
  formations: Formation[] = [];
  isLoading = true;
  errorMessage = '';
  showAddForm = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    console.log('ListeFormationsComponent - Constructor appelé');
  }

  ngOnInit(): void {
    console.log('ListeFormationsComponent - ngOnInit appelé');
    this.loadFormations();
  }

loadFormations(): void {
  console.log('Tentative de chargement depuis: http://localhost:8081/formations');
  
  this.apiService.getFormations().subscribe({
    next: (data) => {
      console.log('Données reçues:', data);
      this.formations = data;
      this.isLoading = false; // ← ✅ ajout obligatoire ici
    },
    error: (err) => {
      console.error('Détails de l\'erreur:', err);
      if (err.status === 0) {
        this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez qu\'il est démarré.';
      } else {
        this.errorMessage = `Erreur serveur: ${err.status} ${err.statusText}`;
      }
      this.isLoading = false; // ← ✅ aussi ici en cas d’erreur
    }
  });
}


  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  onFormationAdded(newFormation: Formation | null): void {
    if (newFormation) {
this.loadFormations();
      this.showAddForm = false;
      console.log('Formation ajoutée:', newFormation);
    }
  }

  deleteFormation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.apiService.deleteFormation(id).subscribe({
        next: () => {
          this.formations = this.formations.filter(f => f.id !== id);
          console.log('Formation supprimée, ID:', id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
}