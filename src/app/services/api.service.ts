import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';
import { Demande } from '../models/demande.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class ApiService {
  // URLs avec slash final cohérent
  private readonly BASE_URL = 'http://localhost:8081';
  private readonly FORMATIONS_URL = `${this.BASE_URL}/formations/api/`; // Slash final ajouté
  private readonly DEMANDES_URL = `${this.BASE_URL}/demandes/api/`; // Slash final ajouté

  constructor(private http: HttpClient) {}

  // === Formations ===
  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.FORMATIONS_URL); // URL avec slash final
  }

  getFormation(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.FORMATIONS_URL}${id}`); // Pas de slash après l'ID
  }

createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(
        this.FORMATIONS_URL, 
        formation, 
        { headers: new HttpHeaders({'Content-Type': 'application/json'}) }
    );
}
updateFormation(id: number, formation: Formation): Observable<Formation> {
  return this.http.put<Formation>(`${this.FORMATIONS_URL}${id}`, formation);
}





  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.FORMATIONS_URL}${id}`); // Pas de slash après l'ID
  }

  // === Demandes ===
  getDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(this.DEMANDES_URL);
  }

  createDemande(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(this.DEMANDES_URL, demande);
  }

  getFormationForDemande(formationId: number): Observable<any> {
    return this.http.get(`${this.DEMANDES_URL}formulaire/${formationId}`); // Pas de slash après api/
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/api/dashboard/stats`);
  }
}