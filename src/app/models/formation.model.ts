export interface Formation {
    id: number;
    titre: string;
    description: string;
    duree: number;
    planifiee: boolean; // Doit correspondre au backend
    statut?: string;
}