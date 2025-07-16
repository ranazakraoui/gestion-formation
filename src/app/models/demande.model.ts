export interface Demande {
  id_demande?: number; // <- optionnel
  email_collaborateur: string;
  nom_collaborateur: string;
  formation_id: number;
  statut: string;
}
