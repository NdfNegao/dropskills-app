export interface TunnelFormData {
  offreProduitService: string;
  objectifTunnel: string;
  maturiteAudience: string;
  budgetCible: string;
  canauxEntree: string[];
  actifsExistants: string;
  automatisationDesiree: string;
  tonaliteStyle: string;
  longueurTunnel: string;
  inclureUpsell: boolean;
}

export interface TunnelEtape {
  nom: string;
  objectif: string;
  messageCle: string;
  callToAction: string;
  objectionALever: string;
  conseilsCopywriting: string[];
  automatisationSuggestions: string[];
}

export interface TunnelAnalysis {
  schemaTunnel: {
    etapes: string[];
    description: string;
    dureeEstimee: string;
  };
  etapesDetaillees: TunnelEtape[];
  conseilsGeneraux: {
    copywriting: string[];
    automatisation: string[];
    optimisation: string[];
  };
  sequenceEmail: {
    description: string;
    emails: Array<{
      jour: number;
      sujet: string;
      objectif: string;
      contenuCle: string;
    }>;
  };
  metriques: {
    tauxConversionEstime: number;
    complexite: number;
    potentielROI: number;
  };
  outilsRecommandes: string[];
}