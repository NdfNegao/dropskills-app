export interface ICPFormData {
  secteur: string;
  produitService: string;
  promesseUnique: string;
  budgetCible: string;
  canaux: string[];
  zoneGeographique: string;
  tonalite: string;
  // Nouveaux champs pour l'enrichissement
  objectifs?: string;
  defis?: string;
  valeurs?: string;
  situationActuelle?: string;
  situationDesiree?: string;
  solutionsEssayees?: string;
  solutionIdeale?: string;
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
  // Nouvelles sections
  journauxIntimes?: {
    douleur: string;
    victoire: string;
  };
  resumeExpress?: string[];
  accrochesCiblees?: {
    douleur: string[];
    situationRevee: string[];
  };
  ficheActionable: {
    resumeExecutif: string;
    prioritesMarketing: string[];
    prochainEtapes: string[];
    metriquesACles: string[];
  };
}
