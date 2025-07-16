export interface Formation {
  id: number;
  titre: string;
  description: string;
  duree: number;
  planifiee: boolean;
  statut?: 'active' | 'en_cours' | 'terminee' | 'planifiee' | 'annulee'; // Ajout de la propriété statut
}