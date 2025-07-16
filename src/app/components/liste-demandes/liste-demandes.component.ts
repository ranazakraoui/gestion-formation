import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Demande } from '../../models/demande.model';

@Component({
  selector: 'app-liste-demandes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-demandes.component.html',
  styleUrls: ['./liste-demandes.component.css']
})
export class ListeDemandesComponent implements OnInit {
  demandes: Demande[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDemandes();
  }
getStatusClass(statut: string): string {
  switch (statut.toLowerCase()) {
    case 'approuvée':
      return 'badge badge-approuvee';
    case 'rejetée':
      return 'badge badge-rejetee';
    default:
      return 'badge badge-en-attente';
  }
}
  loadDemandes(): void {
    this.apiService.getDemandes().subscribe({
      next: (data: Demande[]) => {
        this.demandes = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du chargement des demandes';
        this.isLoading = false;
      }
    });
  }
}