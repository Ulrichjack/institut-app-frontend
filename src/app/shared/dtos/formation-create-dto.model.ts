export interface FormationCreateDto {
  nom: string;
  description: string;
  duree: string;
  fraisInscription: number;
  prix: number;
  categorie?: string;
  certificatDelivre: boolean;
  nomCertificat?: string;
  programme?: string;
  objectifs?: string;
  materielFourni?: string;
  pourQui?: string;
  competencesAcquises?: string;
  socialProofActif: boolean;
  nombrePlaces: number;
  nombreInscritsAffiche: number;
  photoPrincipale?: string;
  videoPresentation?: string;
  photosGalerie: string[];
  enPromotion: boolean;
  pourcentageReduction: number;
  dateDebutPromo?: string;
  dateFinPromo?: string;
  active: boolean;
}
