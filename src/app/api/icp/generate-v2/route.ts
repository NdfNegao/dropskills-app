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

    // Prompt système amélioré pour des résultats plus précis et exploitables
    const systemPrompt = `Tu es un expert en marketing stratégique et en création d'ICP (Ideal Customer Profile). Tu vas analyser les informations business pour créer un profil client ultra-précis et directement exploitable.

CRITÈRES DE QUALITÉ OBLIGATOIRES :
- Chaque insight doit être SPÉCIFIQUE et CHIFFRÉ quand possible
- Utilise le vocabulaire exact du secteur mentionné
- Base-toi sur des comportements réels observables
- Fournis des données exploitables pour des campagnes marketing
- Évite les généralités comme "améliorer la productivité"

STRUCTURE JSON OBLIGATOIRE :
Tu dois retourner UNIQUEMENT un JSON valide suivant EXACTEMENT cette structure, sans texte avant ou après :

{
  "profilSociodemographique": {
    "age": "Tranche précise (ex: 35-45 ans)",
    "sexe": "Répartition précise (ex: 65% hommes, 35% femmes)",
    "localisation": "Zones géographiques spécifiques",
    "situationPro": "Postes et responsabilités précis",
    "niveauRevenus": "Fourchettes de revenus spécifiques"
  },
  "psychologieMotivations": {
    "besoins": ["Besoins spécifiques et mesurables"],
    "desirs": ["Aspirations concrètes et émotionnelles"],
    "peurs": ["Craintes spécifiques au secteur"],
    "objections": ["Objections réelles avec formulations exactes"]
  },
  "problemePrincipaux": ["Problèmes spécifiques avec impact chiffré"],
  "ouLeTrouver": {
    "canaux": ["Canaux de communication précis"],
    "plateformes": ["Plateformes digitales spécifiques avec audiences"],
    "groupes": ["Noms de groupes et communautés réels"],
    "evenements": ["Événements et lieux précis"]
  },
  "messagingImpactant": {
    "expressions": ["Expressions exactes utilisées par la cible"],
    "accroches": ["3 accroches testables et spécifiques"],
    "styleDiscours": "Style de communication détaillé"
  },
  "budgetPouvoirAchat": {
    "budgetTypique": "Budget moyen avec fourchettes",
    "frequenceAchat": "Fréquence précise avec saisonnalité",
    "facteursPrix": ["Facteurs de décision prix spécifiques"]
  },
  "segments": {
    "principal": {
      "nom": "Nom descriptif du segment principal",
      "description": "Description détaillée avec caractéristiques",
      "pourcentage": "% précis du marché"
    },
    "variantes": [
      {
        "nom": "Segment secondaire 1",
        "description": "Description spécifique",
        "pourcentage": "% du marché"
      }
    ]
  },
  "ficheActionable": {
    "resumeExecutif": "Résumé en 2-3 phrases avec données clés",
    "prioritesMarketing": ["Priorités spécifiques et mesurables"],
    "prochainEtapes": ["Actions concrètes avec délais"],
    "metriquesACles": ["KPIs spécifiques avec benchmarks"]
  },
  "journauxIntimes": {
    "douleur": "Texte de 150 mots à la première personne avec émotions et détails concrets",
    "victoire": "Texte de 150 mots à la première personne décrivant la réussite avec détails sensoriels"
  },
  "resumeExpress": [
    "Ligne 1: Profil démographique",
    "Ligne 2: Situation professionnelle",
    "Ligne 3: Principal défi",
    "Ligne 4: Solution recherchée",
    "Ligne 5: Budget et urgence"
  ],
  "accrochesCiblees": {
    "douleur": [
      "Accroche douleur 1 avec langage exact de la cible",
      "Accroche douleur 2 avec émotion forte",
      "Accroche douleur 3 avec urgence"
    ],
    "situationRevee": [
      "Accroche situation rêvée 1 avec bénéfice concret",
      "Accroche situation rêvée 2 avec transformation",
      "Accroche situation rêvée 3 avec résultat chiffré"
    ]
  }
}

IMPORTANT : Retourne UNIQUEMENT le JSON, sans texte explicatif avant ou après.`;

    const userPrompt = customPrompt || `MISSION : Crée un ICP ultra-précis et exploitable pour ce business.

📊 DONNÉES BUSINESS À ANALYSER :

🏢 SECTEUR & MARCHÉ :
- Secteur d'activité : ${formData.secteur}
- Zone géographique : ${formData.zoneGeographique}
- Contexte concurrentiel : Analyse le marché ${formData.secteur} en ${formData.zoneGeographique}

🎯 OFFRE & POSITIONNEMENT :
- Produit/Service : ${formData.produitService}
- Promesse unique : ${formData.promesseUnique}
- Différenciation : Identifie ce qui rend cette offre unique dans le secteur ${formData.secteur}

💰 STRATÉGIE COMMERCIALE :
- Budget cible par client : ${formData.budgetCible}
- Canaux marketing prioritaires : ${formData.canaux.join(', ')}
- Tonalité de communication : ${formData.tonalite}

🎯 INSTRUCTIONS SPÉCIFIQUES :

1. PROFIL SOCIODÉMOGRAPHIQUE : Sois précis sur l'âge, le sexe, la localisation, la situation pro et les revenus. Utilise des données réalistes pour le secteur ${formData.secteur}.

2. PSYCHOLOGIE : Identifie les besoins SPÉCIFIQUES au secteur ${formData.secteur}, pas des généralités. Utilise le vocabulaire exact de cette industrie.

3. PROBLÈMES : Liste les problèmes concrets que ${formData.produitService} résout, avec impact chiffré quand possible.

4. CANAUX : Sois spécifique sur où trouver cette cible. Nomme des plateformes, groupes, événements RÉELS du secteur ${formData.secteur}.

5. MESSAGING : Utilise le langage exact de la cible. Les accroches doivent être testables immédiatement.

6. BUDGET : Base-toi sur le budget ${formData.budgetCible} pour définir le pouvoir d'achat et les facteurs de décision.

7. SEGMENTS : Crée des segments précis avec des pourcentages réalistes basés sur le marché ${formData.secteur}.

8. JOURNAUX INTIMES : Écris à la première personne avec des émotions authentiques et des détails concrets du quotidien dans le secteur ${formData.secteur}.

9. ACCROCHES : Utilise le langage exact de la cible, ses expressions, ses douleurs réelles.

⚠️ ÉVITE ABSOLUMENT :
- Les généralités comme "améliorer la productivité"
- Les expressions marketing clichées
- Les données inventées non réalistes
- Les besoins trop vagues

✅ PRIVILÉGIE :
- Les données chiffrées et mesurables
- Le vocabulaire spécifique au secteur ${formData.secteur}
- Les comportements observables
- Les insights exploitables pour des campagnes

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
      
      // Fallback intelligent avec données spécifiques basées sur le secteur et l'offre
      const secteurSpecific: Record<string, any> = {
        'e-commerce': {
          age: '28-45 ans',
          besoins: ['Augmenter le taux de conversion de 15-25%', 'Réduire le coût d\'acquisition client de 30%', 'Optimiser le panier moyen (+40%)', 'Automatiser le remarketing'],
          plateformes: ['Facebook Business', 'Google Ads', 'Shopify Community', 'BigCommerce Forums'],
          problemes: ['Taux de conversion faible (<2%)', 'Coût d\'acquisition trop élevé (>50€)', 'Abandon de panier (70%+)', 'Gestion manuelle des campagnes']
        },
        'coaching': {
          age: '35-55 ans',
          besoins: ['Automatiser la prospection (50+ leads/mois)', 'Créer des tunnels de vente efficaces (20%+ conversion)', 'Développer son personal branding', 'Structurer son offre premium'],
          plateformes: ['LinkedIn Sales Navigator', 'Facebook Groups Entrepreneurs', 'YouTube Business', 'Clubhouse'],
          problemes: ['Difficulté à trouver des clients qualifiés', 'Positionnement flou sur le marché', 'Tarification sous-évaluée', 'Processus de vente non optimisé']
        },
        'saas': {
          age: '30-50 ans',
          besoins: ['Réduire le churn rate (<5%)', 'Augmenter l\'ARR de 100%+', 'Optimiser l\'onboarding (time-to-value)', 'Développer les upsells'],
          plateformes: ['Product Hunt', 'Indie Hackers', 'SaaS Communities', 'GitHub'],
          problemes: ['Churn rate élevé (>10%)', 'Acquisition coûteuse', 'Onboarding complexe', 'Faible adoption des fonctionnalités']
        }
      };
      
      const secteurData = secteurSpecific[formData.secteur.toLowerCase()] || secteurSpecific['coaching'];
      
      analysis = {
        profilSociodemographique: {
          age: secteurData.age,
          sexe: "55% hommes, 45% femmes",
          localisation: formData.zoneGeographique || "France métropolitaine, Belgique, Suisse",
          situationPro: `Dirigeants et décideurs du secteur ${formData.secteur}, entrepreneurs, responsables marketing`,
          niveauRevenus: `Budget ${formData.budgetCible} disponible pour solutions ${formData.secteur}`
        },
        psychologieMotivations: {
          besoins: secteurData.besoins,
          desirs: [
            `Devenir leader reconnu dans le ${formData.secteur}`,
            "Atteindre la liberté financière et temporelle",
            `Maîtriser parfaitement ${formData.produitService}`,
            "Avoir des résultats prévisibles et mesurables"
          ],
          peurs: [
            "Investir sans retour sur investissement mesurable",
            `Être dépassé par la concurrence dans le ${formData.secteur}`,
            "Perdre du temps avec des solutions inadaptées",
            "Ne pas savoir utiliser efficacement l'outil"
          ],
          objections: [
             `"Est-ce que ça marche vraiment dans le ${formData.secteur} ?"`,
             `"Le budget ${formData.budgetCible} est-il justifié ?"`,
             "Je n'ai pas le temps de me former",
             "J'ai déjà essayé d'autres solutions sans succès"
            ]
        },
        problemePrincipaux: secteurData.problemes,
        ouLeTrouver: {
          canaux: formData.canaux.slice(0, 4),
          plateformes: secteurData.plateformes,
          groupes: [`Entrepreneurs ${formData.secteur} France`, `Communauté ${formData.secteur} Pro`, "Groupes LinkedIn spécialisés"],
          evenements: [`Salon ${formData.secteur} Paris`, "Webinaires spécialisés", "Meetups entrepreneurs locaux"]
        },
        messagingImpactant: {
          expressions: [
            `"Conversion ${formData.secteur}"`,
            `"ROI ${formData.budgetCible}"`,
            `"Automatisation ${formData.secteur}"`,
            "Résultats mesurables"
          ],
          accroches: [
            `${formData.promesseUnique} - Spécialement pour le ${formData.secteur}`,
            `Transformez votre ${formData.budgetCible} en machine à cash`,
            `${formData.produitService} : La solution que le ${formData.secteur} attendait`
          ],
          styleDiscours: `${formData.tonalite} avec preuves sociales et témoignages clients ${formData.secteur}`
        },
        budgetPouvoirAchat: {
          budgetTypique: `${formData.budgetCible} avec ROI attendu de 300-500% en 6-12 mois`,
          frequenceAchat: "Investissement annuel avec upsells trimestriels",
          facteursPrix: [
            "ROI démontrable avec cas clients similaires",
            `Spécialisation ${formData.secteur} prouvée`,
            "Support et formation inclus",
            "Garantie de résultats ou remboursement"
          ]
        },
        segments: {
          principal: {
            nom: `Leaders ${formData.secteur} Innovants`,
            description: `Dirigeants du ${formData.secteur} avec budget ${formData.budgetCible}, orientés croissance et innovation`,
            pourcentage: "65%"
          },
          variantes: [
            {
              nom: `PME ${formData.secteur} Traditionnelles`,
              description: `Entreprises établies du ${formData.secteur} cherchant à moderniser leurs approches`,
              pourcentage: "25%"
            },
            {
              nom: `Consultants ${formData.secteur} Indépendants`,
              description: `Freelances et consultants spécialisés ${formData.secteur} voulant professionnaliser`,
              pourcentage: "10%"
            }
          ]
        },
      ficheActionable: {
          resumeExecutif: `Client idéal : Dirigeant ${formData.secteur} avec budget ${formData.budgetCible}, présent sur ${formData.canaux.slice(0, 2).join(' et ')}, cherchant ${formData.produitService} pour résoudre [problème spécifique secteur] et atteindre [objectif mesurable].`,
          prioritesMarketing: [
            `Créer 3 études de cas clients ${formData.secteur} avec ROI détaillé`,
            `Lancer campagne ciblée sur ${formData.canaux[0]} avec budget test 20% du ${formData.budgetCible}`,
            `Développer landing page spécifique ${formData.secteur} avec calculateur ROI`,
            `Mettre en place séquence email 7 jours avec témoignages ${formData.secteur}`
          ],
          prochainEtapes: [
            "Créer webinar 'Cas d'usage secteur' mensuel",
            "Développer partenariats sectoriels",
            "Optimiser le tunnel de conversion",
            "Mettre en place le tracking avancé"
          ],
          metriquesACles: [
            `Taux conversion landing ${formData.secteur} (objectif >15%)`,
            `CAC ${formData.secteur} vs autres secteurs`,
            `LTV clients ${formData.secteur} (objectif 5x CAC)`,
            "Temps cycle de vente secteur"
          ]
        },
      journauxIntimes: {
        douleur: `Encore 3h perdues aujourd'hui avec [outil concurrent] qui ne comprend rien au ${formData.secteur}. Mon budget ${formData.budgetCible} part en fumée, je n'ai aucune visibilité sur le ROI. Mes concurrents ${formData.secteur} semblent avoir trouvé LA solution, pas moi. Je dois justifier chaque euro dépensé, mais ${formData.produitService} actuel ne donne pas de preuves. Mon équipe perd confiance, on dirait qu'on avance à l'aveugle. Cette situation me stresse énormément et je me sens dépassé par les événements.`,
        victoire: `ENFIN ! ${formData.produitService} qui parle ${formData.secteur} et livre des résultats concrets. ROI de 400% en 4 mois, je peux enfin dormir tranquille. Mon équipe est remotivée, on a des données claires et des objectifs atteignables. Je suis devenu LA référence ${formData.secteur} dans ma région grâce à cette solution. Mes concurrents me demandent maintenant comment je fais. Je ressens une fierté immense et une confiance retrouvée dans mes décisions business.`
      },
      resumeExpress: [
          `Dirigeant ${formData.secteur}, budget ${formData.budgetCible}`,
          `Cherche ${formData.produitService} ROI-driven avec preuves secteur`,
          `Priorité : résultats mesurables et support expert`,
          `Canaux privilégiés : ${formData.canaux.slice(0, 2).join(', ')}`,
          `Tonalité : ${formData.tonalite} avec preuves sociales`
        ],
      accrochesCiblees: {
          douleur: [
            `Dirigeant ${formData.secteur} : Marre de claquer ${formData.budgetCible} dans des solutions qui ne marchent pas ?`,
            `Pourquoi 90% des ${formData.produitService} échouent dans le ${formData.secteur} (et comment éviter le piège)`,
            `${formData.secteur} : Stop aux promesses marketing, voici les VRAIES métriques qui comptent`
          ],
          situationRevee: [
            `${formData.secteur} : Comment transformer votre ${formData.budgetCible} en machine à cash (étude de cas réel)`,
            `De 0 à leader ${formData.secteur} en 12 mois : la méthode que vos concurrents cachent`,
            `${formData.produitService} : La solution que 95% des ${formData.secteur} ignorent encore`
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