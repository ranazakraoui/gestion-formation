export interface Demande {
  id_demande?: number;
  nom_collaborateur: string;
  email_collaborateur: string;
  formation_id: number;
  statut: string;
  date_demande?: Date;
}