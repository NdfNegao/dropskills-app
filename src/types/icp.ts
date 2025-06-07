export interface ICPFormData {
  secteur: string;
  produitService: string;
  promesseUnique: string;
  budgetCible: string;
  canaux: string[];
  zoneGeographique: string;
  tonalite: string;
}

export interface ICPAnalysis {
  profilSociodemographique: {
    age: string;
    sexe: string;
    localisation: string;
    situationPro: string;
    niveauRevenus: string;
  };
  psychologieMotivations: {
    besoins: string[];
    desirs: string[];
    peurs: string[];
    objections: string[];
  };
  problemePrincipaux: string[];
  ouLeTrouver: {
    canaux: string[];
    plateformes: string[];
    groupes: string[];
    evenements: string[];
  };
  messagingImpactant: {
    expressions: string[];
    accroches: string[];
    styleDiscours: string;
  };
  budgetPouvoirAchat: {
    budgetTypique: string;
    frequenceAchat: string;
    facteursPrix: string[];
  };
  segments: {
    principal: {
      nom: string;
      description: string;
      pourcentage: string;
    };
    variantes: Array<{
      nom: string;
      description: string;
      pourcentage: string;
    }>;
  };
  ficheActionable: {
    resumeExecutif: string;
    prioritesMarketing: string[];
    prochainEtapes: string[];
    metriquesACles: string[];
  };
}
