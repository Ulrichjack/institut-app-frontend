export interface FormationListDto {
  id: number;
  nom: string;
  description: string;
  duree: string;
  fraisInscription: number;
  prix: number;
  prixAvecReduction?: number;
  categorie?: string;
  photoPrincipale?: string;
  nombrePlaces: number;
  nombreInscritsAffiche: number;
  placesRestantes?: number;
  tauxRemplissage?: number;
  messageSocialProof?: string;
  enPromotion: boolean;
  pourcentageReduction?: number;
  promoActive: boolean;
  certificatDelivre: boolean;
  slug: string;
  active: boolean;
  nombreVues: number;
}
