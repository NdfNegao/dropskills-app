// Prompts centralisés pour DropSkills
export const SYSTEM_PROMPTS = {
  default: 'Tu es un expert en marketing digital et copywriting. Réponds toujours en français avec un ton professionnel et engageant.',
  
  icp: `Tu es un expert en stratégie marketing, persona et IA.
À partir des informations suivantes, dresse le portrait ultra-précis du client idéal (ICP) pour ce business.
Tu dois répondre UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure...`,

  titles: `Tu es un expert en copywriting et création de titres accrocheurs.
Génère des titres optimisés pour maximiser le taux de clic et l'engagement.`,



  emails: `Tu es un expert en copywriting et email marketing automation.
Génère des séquences d'emails qui nurturent et convertissent.`,

  tunnel: `Tu es expert en copywriting, funnel marketing et automatisation business.
Conçois des tunnels de vente optimisés pour maximiser les conversions.`,

  usp: `Tu es expert en copywriting, marketing et différenciation business.
Génère des USP percutantes qui différencient vraiment du marché.`,

  veille: `Tu es un expert en veille stratégique, IA et business digital.
Détecte des opportunités business innovantes et à fort potentiel.`
} as const;

export const TONE_OPTIONS = {
  accrocheur: 'accrocheurs et impactants',
  professionnel: 'professionnels et crédibles',
  emotionnel: 'émotionnels et engageants',
  urgent: 'urgents et persuasifs',
  commercial: 'commerciaux et persuasifs',
  technique: 'techniques et détaillés',
  casual: 'décontractés et accessibles'
} as const;

export const TONE_GUIDELINES = {
  accrocheur: `- Utilise des mots puissants (révolutionnaire, secret, incroyable)
- Crée de la curiosité
- Promets un bénéfice clair`,

  professionnel: `- Ton expert et crédible
- Focus sur la qualité et les résultats
- Évite les superlatifs excessifs
- Utilise un vocabulaire précis`,

  emotionnel: `- Connecte avec les émotions (peur, désir, espoir)
- Utilise "vous" pour personnaliser
- Évoque des situations concrètes
- Raconte une histoire`,

  urgent: `- Crée un sentiment d'urgence
- Utilise des mots d'action
- Évoque la rareté ou le temps limité`,

  commercial: `- Ton persuasif et orienté vente
- Crée de l'urgence et du désir
- Met en avant les bénéfices clients
- Utilise des preuves sociales`,

  technique: `- Détaille les spécifications
- Utilise un vocabulaire technique
- Explique le fonctionnement
- Met en avant l'innovation`,

  casual: `- Ton décontracté et amical
- Utilise un langage simple
- Évite le jargon technique
- Reste accessible à tous`
} as const;

export const CONTENT_TYPES = {
  article: 'un article de blog',
  video: 'une vidéo YouTube',
  email: 'un email marketing',
  social: 'un post sur les réseaux sociaux',
  landing: 'une landing page',
  ad: 'une publicité'
} as const;

// Builders de prompts réutilisables
export class PromptBuilder {
  static buildTitlesPrompt({ 
    subject, 
    audience, 
    tone, 
    type 
  }: {
    subject: string;
    audience?: string;
    tone: keyof typeof TONE_OPTIONS;
    type: keyof typeof CONTENT_TYPES;
  }) {
    const audienceText = audience ? ` pour ${audience}` : '';
    const typeText = CONTENT_TYPES[type] || 'un contenu';
    const toneText = TONE_OPTIONS[tone] || 'engageants';

    return `Génère 8 titres ${toneText} pour ${typeText} sur le sujet "${subject}"${audienceText}.

CONTRAINTES:
- Titres en français
- Maximum 80 caractères par titre
- Utilise des émojis pertinents
- Varie les structures (questions, affirmations, listes)
- Optimisés pour le clic et l'engagement

STYLE ${tone.toUpperCase()}:
${TONE_GUIDELINES[tone]}

FORMAT DE RÉPONSE (JSON uniquement):
{
  "titles": [
    "🚀 Titre 1 ici",
    "💡 Titre 2 ici",
    "..."
  ]
}`;
  }



  static buildCustomPrompt(
    systemPrompt: keyof typeof SYSTEM_PROMPTS,
    userPrompt: string,
    options?: {
      tone?: keyof typeof TONE_OPTIONS;
      format?: 'json' | 'text';
      constraints?: string[];
    }
  ) {
    let prompt = SYSTEM_PROMPTS[systemPrompt];
    
    if (options?.tone) {
      prompt += `\n\nTONALITÉ ${options.tone.toUpperCase()}:\n${TONE_GUIDELINES[options.tone]}`;
    }
    
    if (options?.constraints) {
      prompt += `\n\nCONTRAINTES:\n${options.constraints.map(c => `- ${c}`).join('\n')}`;
    }
    
    if (options?.format === 'json') {
      prompt += '\n\nRéponds UNIQUEMENT avec un JSON valide.';
    }
    
    return prompt + '\n\n' + userPrompt;
  }
}

// Templates de prompts complexes
export const COMPLEX_PROMPTS = {
  icp: `Tu es un expert en stratégie marketing, persona et IA.
À partir des informations suivantes, dresse le portrait ultra-précis du client idéal (ICP) pour ce business.

Tu dois répondre UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure :

{
  "profilSociodemographique": {
    "age": "Tranche d'âge précise",
    "sexe": "Répartition hommes/femmes",
    "localisation": "Zone géographique détaillée",
    "situationPro": "Statut professionnel",
    "niveauRevenus": "Revenus mensuels/annuels"
  },
  "psychologieMotivations": {
    "besoins": ["Besoin 1", "Besoin 2", "Besoin 3"],
    "desirs": ["Désir 1", "Désir 2", "Désir 3"],
    "peurs": ["Peur 1", "Peur 2", "Peur 3"],
    "objections": ["Objection 1", "Objection 2", "Objection 3"]
  },
  "problemePrincipaux": ["Problème 1", "Problème 2", "Problème 3"],
  "ouLeTrouver": {
    "canaux": ["Canal 1", "Canal 2", "Canal 3"],
    "plateformes": ["Plateforme 1", "Plateforme 2"],
    "groupes": ["Groupe 1", "Groupe 2"],
    "evenements": ["Événement 1", "Événement 2"]
  },
  "messagingImpactant": {
    "expressions": ["Expression 1", "Expression 2", "Expression 3"],
    "accroches": ["Accroche 1", "Accroche 2", "Accroche 3"],
    "styleDiscours": "Description du style de communication"
  },
  "budgetPouvoirAchat": {
    "budgetTypique": "Montant précis",
    "frequenceAchat": "Fréquence d'achat",
    "facteursPrix": ["Facteur 1", "Facteur 2", "Facteur 3"]
  },
  "segments": {
    "principal": {
      "nom": "Nom du segment principal",
      "description": "Description détaillée",
      "pourcentage": "70%"
    },
    "variantes": [
      {
        "nom": "Segment secondaire 1",
        "description": "Description",
        "pourcentage": "20%"
      },
      {
        "nom": "Segment secondaire 2", 
        "description": "Description",
        "pourcentage": "10%"
      }
    ]
  },
  "ficheActionable": {
    "resumeExecutif": "Synthèse en 2-3 phrases de l'ICP",
    "prioritesMarketing": ["Priorité 1", "Priorité 2", "Priorité 3"],
    "prochainEtapes": ["Étape 1", "Étape 2", "Étape 3"],
    "metriquesACles": ["Métrique 1", "Métrique 2", "Métrique 3"]
  }
}

Sois concis, opérationnel, sans bullshit, et mets-toi à la place d'un marketer qui doit vendre demain matin.`
} as const;