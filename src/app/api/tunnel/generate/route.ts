import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { TunnelFormData } from '@/app/outils/tunnel-maker/page';

interface TunnelRequestData extends TunnelFormData {
  icpData?: any;
  uspData?: any;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData: TunnelRequestData = await request.json();
    
    // Validation des données
    if (!formData.offreProduitService?.trim() || !formData.objectifTunnel?.trim()) {
      return NextResponse.json(
        { error: 'Les champs offre/produit et objectif du tunnel sont requis' },
        { status: 400 }
      );
    }

    // Prompt système optimisé pour les tunnels de vente
    const systemPrompt = `Tu es expert en copywriting, funnel marketing et automatisation business.
À partir des infos suivantes, génère la structure optimale d'un tunnel de vente complet qui maximise les conversions pour ce business.

Tu dois répondre UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure :

{
  "schemaTunnel": {
    "etapes": ["Pub Facebook", "Landing Page", "Opt-in", "Email Nurturing", "Page de Vente", "Paiement", "Upsell", "Merci"],
    "description": "Description du tunnel en 1-2 phrases",
    "dureeEstimee": "2-4 semaines"
  },
  "etapesDetaillees": [
    {
      "nom": "Nom de l'étape",
      "objectif": "Objectif principal de cette étape",
      "messageCle": "Message principal à communiquer",
      "callToAction": "CTA spécifique pour cette étape",
      "objectionALever": "Principale objection à traiter",
      "conseilsCopywriting": ["Conseil 1", "Conseil 2", "Conseil 3"],
      "automatisationSuggestions": ["Suggestion 1", "Suggestion 2"]
    }
  ],
  "conseilsGeneraux": {
    "copywriting": ["Conseil copywriting général 1", "Conseil 2", "Conseil 3"],
    "automatisation": ["Conseil automatisation 1", "Conseil 2", "Conseil 3"],
    "optimisation": ["Conseil optimisation 1", "Conseil 2", "Conseil 3"]
  },
  "sequenceEmail": {
    "description": "Description de la stratégie email",
    "emails": [
      {
        "jour": 1,
        "sujet": "Sujet de l'email",
        "objectif": "Objectif de cet email",
        "contenuCle": "Contenu principal à inclure"
      }
    ]
  },
  "metriques": {
    "tauxConversionEstime": 15,
    "complexite": 7,
    "potentielROI": 5
  },
  "outilsRecommandes": ["Outil 1", "Outil 2", "Outil 3"]
}

Contraintes :
- Personnalise selon le niveau de maturité du public, l'offre, le canal d'acquisition
- Privilégie la simplicité et l'efficacité
- Si le business n'a pas d'upsell/cross-sell, propose-en un pertinent
- Reste pragmatique, orienté résultat (format Dropskills)
- Adapte la longueur selon les préférences utilisateur
- Inclus des conseils d'automatisation IA concrets`;

    // Construction du prompt utilisateur avec toutes les données
    let userPrompt = `Génère le tunnel de vente optimal pour ce business :

**OFFRE/PRODUIT/SERVICE :** ${formData.offreProduitService}

**OBJECTIF DU TUNNEL :** ${formData.objectifTunnel}

**MATURITÉ AUDIENCE :** ${formData.maturiteAudience}

**BUDGET CIBLE :** ${formData.budgetCible}

**CANAUX D'ENTRÉE :** ${formData.canauxEntree.join(', ')}

**ACTIFS EXISTANTS :** ${formData.actifsExistants}

**AUTOMATISATION DÉSIRÉE :** ${formData.automatisationDesiree}

**TONALITÉ/STYLE :** ${formData.tonaliteStyle}

**LONGUEUR DU TUNNEL :** ${formData.longueurTunnel}

**INCLURE UPSELL :** ${formData.inclureUpsell ? 'Oui' : 'Non'}`;

    // Ajouter les données ICP si disponibles
    if (formData.icpData) {
      userPrompt += `\n\n**DONNÉES ICP DISPONIBLES :**
- Client idéal : ${formData.icpData.profilSociodemographique?.age}, ${formData.icpData.profilSociodemographique?.situationPro}
- Problèmes principaux : ${formData.icpData.problemePrincipaux?.slice(0, 3).join(', ')}
- Canaux préférés : ${formData.icpData.ouLeTrouver?.canaux?.slice(0, 3).join(', ')}
- Budget typique : ${formData.icpData.budgetPouvoirAchat?.budgetTypique}
- Objections courantes : ${formData.icpData.psychologieMotivations?.objections?.slice(0, 2).join(', ')}`;
    }

    // Ajouter les données USP si disponibles
    if (formData.uspData) {
      userPrompt += `\n\n**USP DISPONIBLE :**
- USP principale : ${formData.uspData.uspPrincipale}
- Différenciateur : ${formData.uspData.explication?.differenciateur}
- Conseils d'utilisation : ${formData.uspData.conseilUtilisation?.pageSale}`;
    }

    userPrompt += `\n\nFournis un tunnel complet selon le format JSON demandé.`;

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
      if (!analysis.schemaTunnel || !analysis.etapesDetaillees || !analysis.conseilsGeneraux) {
        throw new Error('Format de réponse invalide');
      }

      // Validation et normalisation des métriques
      if (analysis.metriques) {
        analysis.metriques.tauxConversionEstime = Math.min(100, Math.max(0, analysis.metriques.tauxConversionEstime || 15));
        analysis.metriques.complexite = Math.min(10, Math.max(1, analysis.metriques.complexite || 5));
        analysis.metriques.potentielROI = Math.min(20, Math.max(1, analysis.metriques.potentielROI || 3));
      } else {
        analysis.metriques = {
          tauxConversionEstime: 15,
          complexite: 5,
          potentielROI: 3
        };
      }

      // Validation des étapes détaillées
      if (!Array.isArray(analysis.etapesDetaillees)) {
        analysis.etapesDetaillees = [];
      }

      // Validation de la séquence email
      if (!analysis.sequenceEmail || !Array.isArray(analysis.sequenceEmail.emails)) {
        analysis.sequenceEmail = {
          description: "Séquence email de nurturing personnalisée",
          emails: [
            {
              jour: 1,
              sujet: "Bienvenue dans votre parcours",
              objectif: "Accueil",
              contenuCle: "Message de bienvenue et présentation de la valeur"
            }
          ]
        };
      }

      // Validation des outils recommandés
      if (!Array.isArray(analysis.outilsRecommandes)) {
        analysis.outilsRecommandes = ["ClickFunnels", "Mailchimp", "Zapier"];
      }

      return NextResponse.json({
        success: true,
        analysis,
        processingTime: Date.now()
      });

    } catch (error) {
      console.error('Erreur OpenAI lors de la génération du tunnel:', error);
      
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
      
      throw new Error(`Erreur lors de la génération du tunnel avec OpenAI: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

  } catch (error) {
    console.error('Erreur lors de la génération du tunnel:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du tunnel de vente',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 