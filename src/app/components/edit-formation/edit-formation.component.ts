import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Formation } from '../../models/formation.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-formation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-formation.component.html',
  styleUrls: ['./edit-formation.component.css']
})
export class EditFormationComponent implements OnInit {
  formationId!: number;
  formation!: Formation;
  showSuccessMessage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.formationId = +this.route.snapshot.paramMap.get('id')!;
    this.apiService.getFormation(this.formationId).subscribe({
      next: (data: Formation) => this.formation = data,
      error: (err: any) => console.error('Erreur lors de la récupération :', err)
    });
  }

  saveFormation(): void {
    this.apiService.updateFormation(this.formationId, this.formation).subscribe({
      next: () => {
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.router.navigate(['/formations']);
        }, 3000);
      },
      error: (err: any) => console.error('Erreur lors de l’enregistrement :', err)
    });
  }
}
