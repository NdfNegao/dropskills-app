export interface USPFormData {
  resultatPromesse: string;
  problemePrincipal: string;
  differenceUnique: string;
  preuveArgument: string;
  concurrents: string;
  clientIdeal: string;
  tonalite: string;
  contraintes: string;
}

export interface USPAnalysis {
  uspPrincipale: string;
  variantes: {
    rationnel: string;
    emotionnel: string;
    exclusif: string;
  };
  explication: {
    pourquoi: string;
    differenciateur: string;
    impact: string;
  };
  conseilUtilisation: {
    pageSale: string;
    publicite: string;
    reseauxSociaux: string;
    emailMarketing: string;
  };
  metriques: {
    scoreImpact: number;
    memorabilite: number;
    clarte: number;
  };
}