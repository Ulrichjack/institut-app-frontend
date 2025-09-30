export interface FormationUpdateDto {
  nom?: string;
  description?: string;
  duree?: string;
  fraisInscription?: number;
  prix?: number;
  categorie?: string;
  certificatDelivre?: boolean;
  nomCertificat?: string;
  programme?: string;
  objectifs?: string;
  materielFourni?: string;
  horaires?: string;
  frequence?: string;
  nombrePlaces?: number;
  nombreInscritsAffiche?: number;
  socialProofActif?: boolean;
  photoPrincipale?: string;
  photosGalerie?: string[];
  enPromotion?: boolean;
  pourcentageReduction?: number;
  dateDebutPromo?: string;
  dateFinPromo?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  active?: boolean;
}
