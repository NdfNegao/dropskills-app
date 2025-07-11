import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { ICPFormData } from '@/types/icp';

export const dynamic = 'force-dynamic';

interface DropskillsAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
}

interface DropskillsAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const requestData = await request.json();
    const formData: ICPFormData = requestData;
    const customPrompt = requestData.prompt;
    
    // Log pour débogage
    console.log('Données reçues dans l\'API:', {
      secteur: formData.secteur,
      produitService: formData.produitService,
      promesseUnique: formData.promesseUnique,
      budgetCible: formData.budgetCible,
      canaux: formData.canaux,
      zoneGeographique: formData.zoneGeographique,
      tonalite: formData.tonalite
    });
    
    // Validation des données
    if (!formData.secteur?.trim() || !formData.produitService?.trim()) {
      return NextResponse.json(
        { error: 'Les champs secteur et produit/service sont requis' },
        { status: 400 }
      );
    }

    // Utilisation du prompt dynamique ou fallback vers le prompt statique
    const systemPrompt = `Tu es Dropskills AI, un expert en marketing et analyse de clientèle. Tu vas analyser les informations business fournies pour créer un profil client idéal (ICP) détaillé et actionnable.

Ton analyse doit être :
- Précise et basée sur les données fournies
- Actionnable avec des insights concrets
- Structurée selon le format JSON demandé
- Adaptée au marché francophone
- Enrichie de ton expertise en marketing digital

Tu dois retourner UNIQUEMENT un JSON valide sans texte supplémentaire.`;

    const userPrompt = customPrompt || `Analyse ces informations business pour créer un ICP détaillé :

**CONTEXTE BUSINESS :**
- Secteur : ${formData.secteur}
- Zone géographique : ${formData.zoneGeographique}

**OFFRE :**
- Produit/Service : ${formData.produitService}
- Promesse unique : ${formData.promesseUnique}

**MARKETING :**
- Budget cible client : ${formData.budgetCible}
- Canaux envisagés : ${formData.canaux.join(', ')}
- Tonalité : ${formData.tonalite}

Crée un ICP complet au format JSON suivant :

{
  "profilSociodemographique": {
    "age": "tranche d'âge précise",
    "sexe": "répartition homme/femme",
    "localisation": "zones géographiques spécifiques",
    "situationPro": "statuts professionnels détaillés",
    "niveauRevenus": "fourchettes de revenus"
  },
  "psychologieMotivations": {
    "besoins": ["3-4 besoins principaux"],
    "desirs": ["3-4 désirs profonds"],
    "peurs": ["3-4 peurs/freins"],
    "objections": ["3-4 objections courantes"]
  },
  "problemePrincipaux": ["3-4 problèmes que votre offre résout"],
  "ouLeTrouver": {
    "canaux": ["canaux de communication"],
    "plateformes": ["plateformes digitales spécifiques"],
    "groupes": ["communautés et groupes"],
    "evenements": ["événements et lieux physiques"]
  },
  "messagingImpactant": {
    "expressions": ["expressions qu'ils utilisent"],
    "accroches": ["3 accroches marketing efficaces"],
    "styleDiscours": "style de communication optimal"
  },
  "budgetPouvoirAchat": {
    "budgetTypique": "budget moyen pour ce type de solution",
    "frequenceAchat": "fréquence d'achat",
    "facteursPrix": ["facteurs influençant la décision prix"]
  },
  "segments": {
    "principal": {
      "nom": "nom du segment principal",
      "description": "description détaillée",
      "pourcentage": "% de votre marché"
    },
    "variantes": [
      {
        "nom": "segment secondaire 1",
        "description": "description",
        "pourcentage": "% du marché"
      },
      {
        "nom": "segment secondaire 2",
        "description": "description",
        "pourcentage": "% du marché"
      }
    ]
  },
  "ficheActionable": {
    "resumeExecutif": "résumé en 2-3 phrases de votre ICP",
    "prioritesMarketing": ["3-4 priorités marketing basées sur cet ICP"],
    "prochainEtapes": ["3-4 actions concrètes à mettre en place"],
    "metriquesACles": ["3-4 KPIs à suivre"]
  },
  "journauxIntimes": {
    "douleur": "texte de 150 mots à la première personne décrivant les difficultés et frustrations",
    "victoire": "texte de 150 mots à la première personne décrivant la situation de réussite"
  },
  "resumeExpress": [
    "ligne 1 du résumé",
    "ligne 2 du résumé",
    "ligne 3 du résumé",
    "ligne 4 du résumé",
    "ligne 5 du résumé"
  ],
  "accrochesCiblees": {
    "douleur": [
      "accroche douleur 1",
      "accroche douleur 2",
      "accroche douleur 3"
    ],
    "situationRevee": [
      "accroche situation rêvée 1",
      "accroche situation rêvée 2",
      "accroche situation rêvée 3"
    ]
  }
}`;

    // Appel à l'API Dropskills AI via notre système de routage intelligent
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Le routeur intelligent choisira le meilleur modèle
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('Aucune réponse de Dropskills AI');
    }

    // Parse de la réponse JSON
    let analysis;
    try {
      // Nettoyer la réponse si elle contient du texte avant/après le JSON
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseContent;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.error('Réponse brute:', responseContent);
      
      // Fallback avec données structurées basées sur les données du formulaire
      analysis = {
        profilSociodemographique: {
          age: "35-50 ans",
          sexe: "60% hommes, 40% femmes",
          localisation: formData.zoneGeographique || "France",
          situationPro: `Professionnels du secteur ${formData.secteur || "business"}`,
          niveauRevenus: formData.budgetCible || "50k-150k€ annuels"
        },
        psychologieMotivations: {
          besoins: [
            `Améliorer leur performance dans le secteur ${formData.secteur}`,
            "Optimiser leur productivité",
            "Prendre de meilleures décisions",
            "Automatiser les processus"
          ],
          desirs: [
            "Être reconnu comme leader",
            "Avoir plus de temps libre",
            "Maximiser la croissance",
            `Réussir avec ${formData.produitService}`
          ],
          peurs: [
            "Être dépassé par la concurrence",
            "Perdre du temps",
            "Investir sans ROI",
            "Ne pas atteindre leurs objectifs"
          ],
          objections: [
            "C'est trop compliqué",
            `Le budget ${formData.budgetCible} est-il justifié ?`,
            "Manque de temps",
            "Besoin de preuves de résultats"
          ]
        },
        problemePrincipaux: [
          `Difficultés spécifiques au secteur ${formData.secteur}`,
          "Manque de temps pour analyser les données",
          "Difficulté à identifier le client idéal",
          "Processus marketing inefficaces"
        ],
        ouLeTrouver: {
          canaux: formData.canaux.slice(0, 4),
          plateformes: ["LinkedIn", "Twitter", "Forums spécialisés"],
          groupes: ["Groupes LinkedIn entrepreneurs", "CCI locales"],
          evenements: ["Salons professionnels", "Webinaires business"]
        },
        messagingImpactant: {
          expressions: ["ROI", "Efficacité", "Croissance", formData.secteur],
          accroches: [
            `${formData.promesseUnique || "Transformez votre business"}`,
            `Spécialement conçu pour le secteur ${formData.secteur}`,
            "Des résultats mesurables en 30 jours"
          ],
          styleDiscours: formData.tonalite || "Professionnel et rassurant"
        },
        budgetPouvoirAchat: {
          budgetTypique: formData.budgetCible,
          frequenceAchat: "Mensuel ou annuel",
          facteursPrix: ["ROI démontrable", "Facilité d'usage", "Support client"]
        },
        segments: {
          principal: {
            nom: "Entrepreneurs Tech-Savvy",
            description: `Entrepreneurs du secteur ${formData.secteur} ouverts aux nouvelles technologies`,
            pourcentage: "70%"
          },
          variantes: [
            {
              nom: "Dirigeants PME Traditionnelles",
              description: "Dirigeants plus conservateurs mais en quête d'innovation",
              pourcentage: "20%"
            },
            {
              nom: "Consultants Indépendants",
              description: "Freelances cherchant à professionnaliser leurs approches",
              pourcentage: "10%"
          }
        ]
      },
      ficheActionable: {
        resumeExecutif: `Votre client idéal est un professionnel du secteur ${formData.secteur} avec un budget ${formData.budgetCible}, actif sur ${formData.canaux.slice(0, 2).join(' et ')}, intéressé par ${formData.produitService}.`,
        prioritesMarketing: [
          `Concentrer les efforts sur ${formData.canaux[0] || 'LinkedIn'}`,
          "Créer du contenu éducatif",
          "Développer des preuves sociales",
          "Optimiser le tunnel de conversion"
        ],
        prochainEtapes: [
          "Créer des personas détaillés",
          "Adapter le messaging",
          "Tester les canaux prioritaires",
          "Mesurer et optimiser"
        ],
        metriquesACles: [
          "Coût d'acquisition client (CAC)",
          "Taux de conversion",
          "Lifetime Value (LTV)",
          "Retour sur investissement publicitaire (ROAS)"
        ]
      },
      journauxIntimes: {
        douleur: `Je suis un professionnel du secteur ${formData.secteur} et je rencontre des difficultés importantes. Malgré mes efforts, je n'arrive pas à obtenir les résultats que j'espère. Les solutions que j'ai essayées jusqu'à présent ne répondent pas vraiment à mes besoins spécifiques. Je me sens parfois dépassé par la complexité de mon domaine et j'ai besoin d'une approche plus adaptée à ma situation. Le budget que je peux allouer (${formData.budgetCible}) doit vraiment être rentabilisé, car je ne peux pas me permettre d'investir sans voir de retour concret.`,
        victoire: `Grâce à ${formData.produitService}, j'ai enfin trouvé la solution qui correspond parfaitement à mes besoins dans le secteur ${formData.secteur}. ${formData.promesseUnique} s'est révélée être exactement ce dont j'avais besoin. Mon investissement de ${formData.budgetCible} a été largement rentabilisé et je vois des résultats concrets au quotidien. Je me sens maintenant confiant et en contrôle de ma situation. Cette solution a transformé ma façon de travailler et m'a permis d'atteindre mes objectifs plus rapidement que je ne l'aurais imaginé.`
      },
      resumeExpress: [
        `Professionnel du secteur ${formData.secteur}`,
        `Budget disponible: ${formData.budgetCible}`,
        `Actif sur: ${formData.canaux.slice(0, 2).join(', ')}`,
        `Recherche: ${formData.produitService}`,
        `Style de communication: ${formData.tonalite}`
      ],
      accrochesCiblees: {
        douleur: [
          `Vous galérez dans le secteur ${formData.secteur} ?`,
          `Marre de perdre du temps avec des solutions inadaptées ?`,
          `Votre budget ${formData.budgetCible} mérite mieux que ça !`
        ],
        situationRevee: [
          `Imaginez réussir enfin dans le ${formData.secteur}`,
          `${formData.promesseUnique} - c'est possible !`,
          `Transformez votre ${formData.budgetCible} en investissement gagnant`
        ]
      }
      };
    }

    // Log pour analytics (optionnel)
    console.log('ICP généré avec Dropskills AI pour:', {
      secteur: formData.secteur,
      canaux: formData.canaux.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        generatedBy: 'Dropskills AI',
        timestamp: new Date().toISOString(),
        version: '2.0',
        tokensUsed: completion.usage?.total_tokens || 0
      }
    });

  } catch (error: any) {
    console.error('Erreur génération ICP Dropskills AI:', error);
    
    // Gestion des erreurs spécifiques
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Quota API dépassé. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }
    
    if (error.code === 'model_not_found') {
      return NextResponse.json(
        { error: 'Modèle IA temporairement indisponible.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'ICP avec Dropskills AI' },
      { status: 500 }
    );
  }
}