import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Demande } from '../../models/demande.model';
import { Formation } from '../../models/formation.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liste-demandes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liste-demandes.component.html',
  styleUrls: ['./liste-demandes.component.css']
})
export class ListeDemandesComponent implements OnInit {
  demandes: Demande[] = [];
  formations: Formation[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.apiService.formations$.subscribe({
      next: (formations: Formation[]) => {
        this.formations = formations;
        this.loadDemandes();
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des formations';
        this.isLoading = false;
      }
    });
  }

  loadDemandes(): void {
    this.apiService.getDemandes().subscribe({
      next: (data: Demande[]) => {
        console.log('Données reçues:', data); // Debug
        this.demandes = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du chargement des demandes';
        this.isLoading = false;
      }
    });
  }

  getFormationTitre(formationId: number): string {
    if (!formationId) return 'Non spécifiée';
    
    const formation = this.formations.find(f => f.id === formationId);
    return formation?.titre || `ID: ${formationId}`;
  }

  getStatusClass(statut: string): string {
    if (!statut) return 'badge bg-secondary';
    
    switch (statut.toLowerCase()) {
      case 'approuvée': return 'badge bg-success';
      case 'rejetée': return 'badge bg-danger';
      default: return 'badge bg-warning';
    }
  }
}