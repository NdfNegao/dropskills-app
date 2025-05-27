import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { VeilleFormData } from '@/app/outils/agent-veille/page';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData: VeilleFormData = await request.json();
    
    // Validation des données
    if (!formData.secteur?.trim() || !formData.objectif?.trim()) {
      return NextResponse.json(
        { error: 'Les champs secteur et objectif sont requis' },
        { status: 400 }
      );
    }

    // Prompt système optimisé pour la veille et détection d'opportunités
    const systemPrompt = `Tu es un expert en veille stratégique, IA et business digital.
À partir des infos suivantes, génère une liste d'opportunités business ou produits pertinents, innovants, et à fort potentiel pour ce profil.

Pour chaque opportunité, indique :
- Titre/nom de l'opportunité
- Description brève (1 à 2 phrases)
- Secteur/vertical concerné
- Canal/source (où la trouver/exploiter)
- Scoring IA (pertinence, nouveauté, difficulté, potentiel financier, niveau de concurrence)
- Actions recommandées pour en profiter
- Lien ou référence pour aller plus loin

À la fin, propose une synthèse "tendance marché" (ce qui bouge dans le secteur, signaux faibles à surveiller)

Tu dois répondre UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure :

{
  "veilleInfo": {
    "titre": "Titre de l'analyse",
    "description": "Description de la veille",
    "dateAnalyse": "2024-01-01",
    "nombreOpportunites": 10
  },
  "opportunites": [
    {
      "id": "opp-1",
      "titre": "Nom de l'opportunité",
      "description": "Description courte et percutante",
      "secteur": "Secteur concerné",
      "canal": "Canal/Source",
      "scoring": {
        "pertinence": 85,
        "nouveaute": 90,
        "difficulte": 40,
        "potentielFinancier": 95,
        "niveauConcurrence": 30,
        "scoreGlobal": 85
      },
      "actionsRecommandees": [
        "Action 1",
        "Action 2",
        "Action 3"
      ],
      "lienReference": "https://exemple.com",
      "dateDetection": "2024-01-01",
      "tags": ["tag1", "tag2"],
      "isBlueOcean": true
    }
  ],
  "syntheseTendances": {
    "titre": "Synthèse des tendances marché",
    "tendancesPrincipales": ["Tendance 1", "Tendance 2", "Tendance 3"],
    "signauxFaibles": ["Signal 1", "Signal 2"],
    "recommandationsStrategiques": ["Reco 1", "Reco 2", "Reco 3"]
  },
  "metriques": {
    "opportunitesBlueOcean": 3,
    "scoreMovenPertinence": 75,
    "secteursPrioritaires": ["Secteur 1", "Secteur 2"],
    "potentielTotalEstime": "100k-500k€"
  },
  "prochainEtapes": ["Étape 1", "Étape 2", "Étape 3"],
  "outilsRecommandes": ["Outil 1", "Outil 2", "Outil 3"]
}

Contraintes :
- Ne propose que des opportunités accessibles à l'utilisateur selon ses moyens
- Mets en avant les "blue ocean" (peu de concurrence, potentiel fort)
- Classe par ordre de priorité/pertinence (score IA)
- Ton Dropskills : pro, synthétique, actionable
- Génère MINIMUM 8-10 opportunités variées et pertinentes
- Le scoreGlobal doit être la moyenne pondérée des autres scores`;

    // Construction du prompt utilisateur avec toutes les données
    let userPrompt = `Analyse le marché et détecte des opportunités pour ce profil :

**SECTEUR :** ${formData.secteur}

**ZONE GÉOGRAPHIQUE :** ${formData.zone}

**OBJECTIF :** ${formData.objectif}

**TYPES D'OPPORTUNITÉS RECHERCHÉES :** ${formData.typeOpportunite.join(', ')}

**BUDGET/RESSOURCES :** ${formData.budgetRessources}

**FRÉQUENCE DE VEILLE :** ${formData.frequenceVeille}

**CANAUX DE VEILLE PRÉFÉRÉS :** ${formData.canauxVeille.join(', ')}

Génère une analyse complète avec au minimum 8-10 opportunités pertinentes et actionnables.
Privilégie les opportunités "Blue Ocean" avec peu de concurrence et fort potentiel.
Les opportunités doivent être adaptées au budget et aux ressources disponibles.`;

    try {
      const openaiClient = openai();
      
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('Aucune réponse reçue de OpenAI');
      }

      const analysis = JSON.parse(response);

      // Validation de la structure de réponse
      if (!analysis.veilleInfo || !analysis.opportunites || !Array.isArray(analysis.opportunites)) {
        throw new Error('Format de réponse invalide');
      }

      // Enrichir les opportunités avec des données supplémentaires
      const today = new Date().toISOString().split('T')[0];
      analysis.veilleInfo.dateAnalyse = today;
      analysis.veilleInfo.nombreOpportunites = analysis.opportunites.length;

      // Normaliser et valider chaque opportunité
      analysis.opportunites = analysis.opportunites.map((opp: any, index: number) => {
        // Générer un ID unique si manquant
        if (!opp.id) {
          opp.id = `opp-${Date.now()}-${index}`;
        }

        // Date de détection
        opp.dateDetection = today;

        // Validation du scoring
        if (!opp.scoring) {
          opp.scoring = {
            pertinence: 70,
            nouveaute: 70,
            difficulte: 50,
            potentielFinancier: 70,
            niveauConcurrence: 50,
            scoreGlobal: 70
          };
        } else {
          // Calculer le score global si manquant
          const scores = [
            opp.scoring.pertinence || 70,
            opp.scoring.nouveaute || 70,
            opp.scoring.difficulte || 50,
            opp.scoring.potentielFinancier || 70,
            opp.scoring.niveauConcurrence || 50
          ];
          
          // Score global = moyenne pondérée (pertinence et potentiel financier ont plus de poids)
          opp.scoring.scoreGlobal = Math.round(
            (scores[0] * 0.3 + scores[1] * 0.2 + scores[2] * 0.1 + scores[3] * 0.3 + scores[4] * 0.1)
          );
        }

        // Déterminer si c'est une opportunité Blue Ocean
        if (opp.isBlueOcean === undefined) {
          opp.isBlueOcean = opp.scoring.niveauConcurrence < 40 && opp.scoring.potentielFinancier > 70;
        }

        // Ajouter des tags si manquants
        if (!opp.tags || !Array.isArray(opp.tags)) {
          opp.tags = [];
          if (opp.isBlueOcean) opp.tags.push('blue-ocean');
          if (opp.scoring.scoreGlobal >= 80) opp.tags.push('high-priority');
          if (opp.scoring.nouveaute >= 80) opp.tags.push('trending');
        }

        // Valider les actions recommandées
        if (!Array.isArray(opp.actionsRecommandees) || opp.actionsRecommandees.length === 0) {
          opp.actionsRecommandees = [
            'Analyser le marché en détail',
            'Créer un MVP pour tester',
            'Identifier les partenaires potentiels'
          ];
        }

        return opp;
      });

      // Trier par score global décroissant
      analysis.opportunites.sort((a: any, b: any) => b.scoring.scoreGlobal - a.scoring.scoreGlobal);

      // Calculer les métriques globales
      const blueOceanCount = analysis.opportunites.filter((opp: any) => opp.isBlueOcean).length;
      const avgScore = Math.round(
        analysis.opportunites.reduce((sum: number, opp: any) => sum + opp.scoring.scoreGlobal, 0) / 
        analysis.opportunites.length
      );

      if (!analysis.metriques) {
        analysis.metriques = {
          opportunitesBlueOcean: blueOceanCount,
          scoreMovenPertinence: avgScore,
          secteursPrioritaires: [],
          potentielTotalEstime: '50k-200k€'
        };
      } else {
        analysis.metriques.opportunitesBlueOcean = blueOceanCount;
        analysis.metriques.scoreMovenPertinence = avgScore;
      }

      // Identifier les secteurs prioritaires
      const secteurCounts = analysis.opportunites.reduce((acc: any, opp: any) => {
        acc[opp.secteur] = (acc[opp.secteur] || 0) + 1;
        return acc;
      }, {});
      
      analysis.metriques.secteursPrioritaires = Object.entries(secteurCounts)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 3)
        .map((entry: any) => entry[0]);

      // Validation de la synthèse des tendances
      if (!analysis.syntheseTendances) {
        analysis.syntheseTendances = {
          titre: 'Synthèse des tendances marché',
          tendancesPrincipales: [
            'Digitalisation accélérée du secteur',
            'Demande croissante pour l\'automatisation',
            'Nouveaux modèles business émergents'
          ],
          signauxFaibles: [
            'Changements réglementaires à venir',
            'Technologies émergentes à surveiller'
          ],
          recommandationsStrategiques: [
            'Se positionner rapidement sur les opportunités Blue Ocean',
            'Développer des partenariats stratégiques',
            'Investir dans l\'innovation produit'
          ]
        };
      }

      // Validation des prochaines étapes et outils
      if (!Array.isArray(analysis.prochainEtapes)) {
        analysis.prochainEtapes = [
          'Prioriser les 3 meilleures opportunités',
          'Créer un plan d\'action détaillé',
          'Lancer une phase de test sur l\'opportunité principale'
        ];
      }

      if (!Array.isArray(analysis.outilsRecommandes)) {
        analysis.outilsRecommandes = [
          'Google Trends',
          'LinkedIn Sales Navigator',
          'Crunchbase',
          'Product Hunt'
        ];
      }

      return NextResponse.json({
        success: true,
        analysis,
        processingTime: Date.now()
      });

    } catch (error) {
      console.error('Erreur OpenAI lors de l\'analyse:', error);
      
      // Gestion spécifique des erreurs de quota
      if (error instanceof Error && error.message.includes('429')) {
        return NextResponse.json(
          { 
            error: 'Quota OpenAI dépassé. Veuillez réessayer plus tard.',
            details: 'Limite d\'utilisation atteinte'
          },
          { status: 429 }
        );
      }
      
      // Gestion des erreurs de parsing JSON
      if (error instanceof Error && error.message.includes('JSON')) {
        return NextResponse.json(
          { 
            error: 'Erreur de format dans la réponse IA. Veuillez réessayer.',
            details: 'Format de réponse invalide'
          },
          { status: 500 }
        );
      }
      
      throw new Error(`Erreur lors de l'analyse avec OpenAI: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

  } catch (error) {
    console.error('Erreur lors de l\'analyse de veille:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'analyse de veille',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 