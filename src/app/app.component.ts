import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mon-app';
  currentYear = new Date().getFullYear();
  isLoading = false;

  constructor(private http: HttpClient) {}

  // Exemple de méthode pour charger les données avec loader
  loadData() {
    this.isLoading = true;
    this.http.get('/formations/api/filtered').subscribe({
      next: (data) => {
        // Traitement des données
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}