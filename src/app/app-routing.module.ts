import { Routes } from '@angular/router';
import { AjouterFormationComponent } from './components/ajouter-formation/ajouter-formation.component';
import { ListeDemandesComponent } from './components/liste-demandes/liste-demandes.component';
import { CreerDemandeComponent } from './components/creer-demande/creer-demande.component';
import { ListeFormationsComponent } from './components/liste-formations/liste-formations.component'; // Changé ici
import { AccueilComponent } from './components/accueil/accueil.component';
import { EditFormationComponent } from './components/edit-formation/edit-formation.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'formations', component: ListeFormationsComponent },
  { path: 'formations/new', component: AjouterFormationComponent },
  { path: 'demandes', component: ListeDemandesComponent },
{ path: 'creer-demande/:id', component: CreerDemandeComponent },
{
  path: 'formations/edit/:id',
  component: EditFormationComponent
}



,{ path: '**', redirectTo: '' }
]


export default routes;