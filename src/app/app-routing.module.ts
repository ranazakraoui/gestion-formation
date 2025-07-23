import { Routes } from '@angular/router';
import { AjouterFormationComponent } from './components/ajouter-formation/ajouter-formation.component';
import { ListeDemandesComponent } from './components/liste-demandes/liste-demandes.component';
import { CreerDemandeComponent } from './components/creer-demande/creer-demande.component';
import { ListeFormationsComponent } from './components/liste-formations/liste-formations.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { EditFormationComponent } from './components/edit-formation/edit-formation.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'formations', component: ListeFormationsComponent },
  { path: 'formations/new', component: AjouterFormationComponent },
  { path: 'formations/edit/:id', component: EditFormationComponent },
  
  // Routes pour les demandes
  { path: 'demandes', component: ListeDemandesComponent },
  { path: 'demandes/nouvelle', component: CreerDemandeComponent }, // Route pour nouvelle demande
  { path: 'demandes/nouvelle/:id', component: CreerDemandeComponent }, // Route pour demande avec formation pré-sélectionnée
  { path: 'creer-demande/:id', component: CreerDemandeComponent }, // Garde votre route existante pour compatibilité
  
  { path: '**', redirectTo: '' }
];

export default routes;