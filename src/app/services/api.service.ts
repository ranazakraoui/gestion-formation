import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'; // Ajoutez 'map' ici
import { Demande } from '../models/demande.model';
import { Formation } from '../models/formation.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly BASE_URL = 'http://localhost:8081/api';
  private formationsSubject = new BehaviorSubject<Formation[]>([]);
  public formations$ = this.formationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialFormations();
  }

  // ======== FORMATIONS ========
  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.BASE_URL}/formations`)
      .pipe(
        tap(formations => {
          console.log('Formations récupérées:', formations);
          this.formationsSubject.next(formations);
        }),
        catchError(this.handleError)
      );
  }

  getFormation(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.BASE_URL}/formations/${id}`)
      .pipe(catchError(this.handleError));
  }

  createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(`${this.BASE_URL}/formations`, formation)
      .pipe(
        tap(newFormation => {
          console.log('Formation créée:', newFormation);
          this.addFormationToList(newFormation);
        }),
        catchError(this.handleError)
      );
  }

  updateFormation(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.BASE_URL}/formations/${id}`, formation)
      .pipe(
        tap(updatedFormation => {
          console.log('Formation mise à jour:', updatedFormation);
          this.updateFormationInList(updatedFormation);
        }),
        catchError(this.handleError)
      );
  }

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/formations/${id}`)
      .pipe(
        tap(() => {
          console.log('Formation supprimée, ID:', id);
          this.removeFormationFromList(id);
        }),
        catchError(this.handleError)
      );
  }

  // ======== DEMANDES ========
 getDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.BASE_URL}/demandes`).pipe(
      map((demandes: any[]) => {
        return demandes.map(d => ({
          id_demande: d.id || d.id_demande,
          nom_collaborateur: d.nomCollaborateur || d.nom_collaborateur,
          email_collaborateur: d.emailCollaborateur || d.email_collaborateur,
          formation_id: d.formationId || d.formation_id,
          statut: d.statut || 'EN_ATTENTE',
          date_demande: d.dateDemande ? new Date(d.dateDemande) : undefined
        }));
      }),
      catchError(this.handleError)
    );
  }
createDemande(demande: Demande): Observable<Demande> {
  // Convertir les noms de propriétés pour correspondre au backend
  const demandeToSend = {
    nomCollaborateur: demande.nom_collaborateur,
    emailCollaborateur: demande.email_collaborateur,
    formationId: demande.formation_id,
    statut: demande.statut || 'EN_ATTENTE'
  };

  console.log('Envoi de la demande:', JSON.stringify(demandeToSend));
  
  return this.http.post<Demande>(`${this.BASE_URL}/demandes`, demandeToSend, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }).pipe(
    tap(response => console.log('Réponse du serveur:', response)),
    catchError(this.handleError)
  );
}

  getDemandesByFormation(formationId: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.BASE_URL}/demandes/formation/${formationId}`)
      .pipe(catchError(this.handleError));
  }

  // ======== UTILITAIRES ========
  private loadInitialFormations(): void {
    this.getFormations().subscribe({
      next: (formations) => {
        console.log('Formations initiales chargées:', formations.length);
      },
      error: (err) => console.error('Error loading initial formations:', err)
    });
  }
checkFormationDisponible(formationId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASE_URL}/formations/${formationId}/disponible`);
}
  addFormationToList(formation: Formation): void {
    const current = this.formationsSubject.value;
    this.formationsSubject.next([...current, formation]);
  }

  private updateFormationInList(updatedFormation: Formation): void {
    const current = this.formationsSubject.value;
    const index = current.findIndex(f => f.id === updatedFormation.id);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = updatedFormation;
      this.formationsSubject.next(updated);
    }
  }

  private removeFormationFromList(id: number): void {
    const current = this.formationsSubject.value;
    const filtered = current.filter(f => f.id !== id);
    this.formationsSubject.next(filtered);
  }

  // Gestion globale des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inattendue s\'est produite';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le serveur est démarré.';
          break;
        case 400:
          errorMessage = 'Données invalides envoyées au serveur.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 409:
          errorMessage = 'Cette ressource existe déjà.';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur.';
          break;
        default:
          errorMessage = `Erreur serveur: ${error.status} ${error.message}`;
      }
    }

    console.error('Erreur API complète:', error);
    return throwError(() => new Error(errorMessage));
  }
}