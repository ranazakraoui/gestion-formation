import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Formation } from '../../models/formation.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  featuredFormations: Formation[] = [];
  loading = true;
  currentYear = new Date().getFullYear();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadFeaturedFormations();
  }

  loadFeaturedFormations(): void {
    this.apiService.getFormations().subscribe({
      next: (formations) => {
        this.featuredFormations = formations.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement:', err);
        this.loading = false;
      }
    });
  }
}