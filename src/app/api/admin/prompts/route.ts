import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Interface pour les prompts
interface PromptData {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: 'system' | 'user' | 'complex';
  content: string;
  tool: string;
  isActive: boolean;
  parameters?: string;
  performance: {
    usage: number;
    successRate: number;
    avgResponseTime: number;
  };
  lastModified: string;
  version: number;
  createdBy: string;
  systemPrompt?: string;
  tags?: string[];
  usageCount?: number;
  lastUsed?: string;
  createdAt?: string;
  updatedAt?: string;
  stats?: {
    totalUsage: number;
    successRate: number;
    avgResponseTime: number;
  };
  versions?: any[];
}

// Fonction pour obtenir des prompts de démonstration
async function getMockPrompts(): Promise<PromptData[]> {
  return [
    {
      id: '1',
      name: 'ICP Maker - Système',
      description: 'Prompt principal pour la génération de profils clients idéaux',
      category: 'Stratégie',
      type: 'complex',
      content: `Tu es un expert en stratégie marketing, persona et IA.
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

Sois concis, opérationnel, sans bullshit, et mets-toi à la place d'un marketer qui doit vendre demain matin.`,
      tool: 'icp-maker',
      isActive: true,
      parameters: JSON.stringify({
        temperature: 0.7,
        max_tokens: 2000,
        model: 'gpt-4o-mini'
      }),
      performance: { usage: 156, successRate: 94, avgResponseTime: 3.2 },
      lastModified: '2024-01-15',
      version: 3,
      createdBy: 'admin'
    },
    {
      id: '2',
      name: 'Générateur Titres - Accrocheur',
      description: 'Prompt pour générer des titres accrocheurs et impactants',
      category: 'Contenu',
      type: 'user',
      content: `Génère 8 titres accrocheurs et impactants pour {type} sur le sujet "{subject}"{audience}.

CONTRAINTES:
- Titres en français
- Maximum 80 caractères par titre
- Utilise des émojis pertinents
- Varie les structures (questions, affirmations, listes)
- Optimisés pour le clic et l'engagement

STYLE ACCROCHEUR:
- Utilise des mots puissants (révolutionnaire, secret, incroyable)
- Crée de la curiosité
- Promets un bénéfice clair

FORMAT DE RÉPONSE (JSON uniquement):
{
  "titles": [
    "🚀 Titre 1 ici",
    "💡 Titre 2 ici",
    "..."
  ]
}`,
      tool: 'titles',
      isActive: true,
      parameters: JSON.stringify({
        temperature: 0.8,
        max_tokens: 800,
        model: 'gpt-3.5-turbo'
      }),
      performance: { usage: 89, successRate: 91, avgResponseTime: 2.1 },
      lastModified: '2024-01-12',
      version: 2,
      createdBy: 'admin'
    }
  ];
}

// Données de démonstration (à remplacer par une vraie base de données)
let mockPrompts: PromptData[] = [
  {
    id: '1',
    name: 'ICP Maker - Système',
    description: 'Prompt principal pour la génération de profils clients idéaux',
    category: 'Stratégie',
    type: 'complex',
    content: `Tu es un expert en stratégie marketing, persona et IA.
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

Sois concis, opérationnel, sans bullshit, et mets-toi à la place d'un marketer qui doit vendre demain matin.`,
    tool: 'icp-maker',
    isActive: true,
    parameters: JSON.stringify({
      temperature: 0.7,
      max_tokens: 2000,
      model: 'gpt-4o-mini'
    }),
    performance: { usage: 156, successRate: 94, avgResponseTime: 3.2 },
    lastModified: '2024-01-15',
    version: 3,
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'Générateur Titres - Accrocheur',
    description: 'Prompt pour générer des titres accrocheurs et impactants',
    category: 'Contenu',
    type: 'user',
    content: `Génère 8 titres accrocheurs et impactants pour {type} sur le sujet "{subject}"{audience}.

CONTRAINTES:
- Titres en français
- Maximum 80 caractères par titre
- Utilise des émojis pertinents
- Varie les structures (questions, affirmations, listes)
- Optimisés pour le clic et l'engagement

STYLE ACCROCHEUR:
- Utilise des mots puissants (révolutionnaire, secret, incroyable)
- Crée de la curiosité
- Promets un bénéfice clair

FORMAT DE RÉPONSE (JSON uniquement):
{
  "titles": [
    "🚀 Titre 1 ici",
    "💡 Titre 2 ici",
    "..."
  ]
}`,
    tool: 'titles',
    isActive: true,
    parameters: JSON.stringify({
      temperature: 0.8,
      max_tokens: 800,
      model: 'gpt-3.5-turbo'
    }),
    performance: { usage: 89, successRate: 91, avgResponseTime: 2.1 },
    lastModified: '2024-01-12',
    version: 2,
    createdBy: 'admin'
  }
];

// GET - Récupérer tous les prompts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.email !== 'cyril.iriebi@gmail.com') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const tool = searchParams.get('tool');
    const active = searchParams.get('active');

    let filteredPrompts = [...mockPrompts];

    // Filtres
    if (category) {
      filteredPrompts = filteredPrompts.filter(p => p.category === category);
    }
    if (type) {
      filteredPrompts = filteredPrompts.filter(p => p.type === type);
    }
    if (tool) {
      filteredPrompts = filteredPrompts.filter(p => p.tool === tool);
    }
    if (active !== null) {
      filteredPrompts = filteredPrompts.filter(p => p.isActive === (active === 'true'));
    }

    return NextResponse.json({
      prompts: filteredPrompts,
      total: filteredPrompts.length,
      stats: {
        total: mockPrompts.length,
        active: mockPrompts.filter(p => p.isActive).length,
        avgSuccessRate: Math.round(mockPrompts.reduce((sum, p) => sum + p.performance.successRate, 0) / mockPrompts.length),
        totalUsage: mockPrompts.reduce((sum, p) => sum + p.performance.usage, 0)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des prompts:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer un nouveau prompt
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.email !== 'cyril.iriebi@gmail.com') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, type, content, tool, parameters, isActive } = body;

    // Validation
    if (!name || !category || !type || !content || !tool) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Créer le nouveau prompt
    const newPrompt: PromptData = {
      id: (mockPrompts.length + 1).toString(),
      name,
      description: description || '',
      category,
      type,
      content,
      tool,
      isActive: isActive !== false,
      parameters: parameters || JSON.stringify({
        temperature: 0.7,
        max_tokens: 1000,
        model: 'gpt-3.5-turbo'
      }),
      performance: { usage: 0, successRate: 0, avgResponseTime: 0 },
      lastModified: new Date().toISOString().split('T')[0],
      version: 1,
      createdBy: session.user.email
    };

    mockPrompts.push(newPrompt);

    return NextResponse.json({ 
      message: 'Prompt créé avec succès',
      prompt: newPrompt 
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du prompt:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour un prompt
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.email !== 'cyril.iriebi@gmail.com') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, category, type, content, tool, parameters, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID du prompt requis' }, { status: 400 });
    }

    const promptIndex = mockPrompts.findIndex(p => p.id === id);
    if (promptIndex === -1) {
      return NextResponse.json({ error: 'Prompt non trouvé' }, { status: 404 });
    }

    // Mettre à jour le prompt
    const updatedPrompt = {
      ...mockPrompts[promptIndex],
      name: name || mockPrompts[promptIndex].name,
      description: description !== undefined ? description : mockPrompts[promptIndex].description,
      category: category || mockPrompts[promptIndex].category,
      type: type || mockPrompts[promptIndex].type,
      content: content || mockPrompts[promptIndex].content,
      tool: tool || mockPrompts[promptIndex].tool,
      parameters: parameters || mockPrompts[promptIndex].parameters,
      isActive: isActive !== undefined ? isActive : mockPrompts[promptIndex].isActive,
      lastModified: new Date().toISOString().split('T')[0],
      version: mockPrompts[promptIndex].version + 1
    };

    mockPrompts[promptIndex] = updatedPrompt;

    return NextResponse.json({ 
      message: 'Prompt mis à jour avec succès',
      prompt: updatedPrompt 
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du prompt:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un prompt
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.email !== 'cyril.iriebi@gmail.com') {
      return NextResponse.json({ error: 'Non autorisé - Super Admin requis' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID du prompt requis' }, { status: 400 });
    }

    const promptIndex = mockPrompts.findIndex(p => p.id === id);
    if (promptIndex === -1) {
      return NextResponse.json({ error: 'Prompt non trouvé' }, { status: 404 });
    }

    const deletedPrompt = mockPrompts.splice(promptIndex, 1)[0];

    return NextResponse.json({ 
      message: 'Prompt supprimé avec succès',
      prompt: deletedPrompt 
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du prompt:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}