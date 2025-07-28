import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Formation } from '../../models/formation.model';
import { ApiService } from '../../services/api.service';
import { AjouterFormationComponent } from '../ajouter-formation/ajouter-formation.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-formations',
  standalone: true,
  imports: [CommonModule, AjouterFormationComponent, TruncatePipe, RouterLink, FormsModule],
  templateUrl: './liste-formations.component.html',
  styleUrls: ['./liste-formations.component.css']
})
export class ListeFormationsComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = []; // Nouvelle propriété pour les résultats filtrés
  searchTerm: string = ''; // Terme de recherche
  isLoading = true;
  errorMessage = '';
  showAddForm = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

loadFormations(): void {
    this.apiService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.filteredFormations = [...this.formations]; // Initialise filteredFormations
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = err.status === 0 
          ? 'Impossible de se connecter au serveur' 
          : `Erreur serveur: ${err.status}`;
        this.isLoading = false;
      }
    });
  }

   searchFormations(): void {
    if (!this.searchTerm) {
      this.filteredFormations = [...this.formations];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredFormations = this.formations.filter(formation => 
      formation.titre.toLowerCase().includes(term) ||
      (formation.description && formation.description.toLowerCase().includes(term))
    );
  }
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  onFormationAdded(newFormation: Formation | null): void {
    if (newFormation) {
      this.loadFormations();
      this.showAddForm = false;
    }
  }

  deleteFormation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.apiService.deleteFormation(id).subscribe({
        next: () => {
          this.formations = this.formations.filter(f => f.id !== id);
          this.filteredFormations = this.filteredFormations.filter(f => f.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
}