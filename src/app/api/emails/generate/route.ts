import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { EmailFormData } from '@/app/outils/copymoneymail/page';

export const dynamic = 'force-dynamic';

interface EmailRequestData extends EmailFormData {
  icpData?: any;
  uspData?: any;
  tunnelData?: any;
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

    const formData: EmailRequestData = await request.json();
    
    // Validation des données
    if (!formData.objectifSequence?.trim() || !formData.offreProduitService?.trim()) {
      return NextResponse.json(
        { error: 'Les champs objectif et offre sont requis' },
        { status: 400 }
      );
    }

    // Prompt système optimisé pour les séquences email
    const systemPrompt = `Tu es un expert en copywriting et email marketing automation.
À partir des informations suivantes, génère une séquence complète d'emails (1 par étape) pour atteindre l'objectif défini.

Tu dois répondre UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure :

{
  "sequenceInfo": {
    "titre": "Titre de la séquence",
    "description": "Description courte de la séquence",
    "dureeTotal": "Ex: 7 jours",
    "objectifGlobal": "Objectif principal de la séquence"
  },
  "emails": [
    {
      "numeroEmail": 1,
      "sujet": "Sujet/courte accroche pour l'objet",
      "varianteSujet": "Variante d'objet (A/B test)",
      "corpsMessage": "Corps complet du message avec storytelling, promesse, appel à l'action, objection traitée",
      "momentEnvoi": "J+1, J+3...",
      "conseilsEnvoi": "Conseil sur le moment idéal d'envoi",
      "objectifEmail": "Objectif spécifique de cet email",
      "metriquesEstimees": {
        "tauxOuverture": 35,
        "tauxClic": 8,
        "tauxConversion": 2
      }
    }
  ],
  "conseilsGeneraux": {
    "segmentation": ["Conseil 1", "Conseil 2"],
    "automatisation": ["Conseil 1", "Conseil 2"],
    "optimisation": ["Conseil 1", "Conseil 2"],
    "delivrabilite": ["Conseil 1", "Conseil 2"]
  },
  "metriquesGlobales": {
    "tauxOuvertureEstime": 30,
    "tauxClicEstime": 7,
    "tauxConversionEstime": 2,
    "revenusEstimes": "10-50k€"
  },
  "outilsRecommandes": ["Outil 1", "Outil 2", "Outil 3"],
  "prochainEtapes": ["Étape 1", "Étape 2", "Étape 3"]
}

Contraintes :
- Séquence orientée résultat, ton adapté à la cible et à l'offre
- Mets en avant le bénéfice client et l'urgence d'agir
- Si le nombre d'emails n'est pas précisé, propose un minimum viable (ex : 5)
- Ajoute une touche humaine et dynamique (signature Dropskills, no bullshit)
- Chaque email doit avoir un objectif clair et une progression logique
- Utilise des techniques de copywriting éprouvées (AIDA, PAS, etc.)`;

    // Construction du prompt utilisateur avec toutes les données
    let userPrompt = `Génère une séquence email complète pour ce business :

**OBJECTIF SÉQUENCE :** ${formData.objectifSequence}

**OFFRE/PRODUIT/SERVICE :** ${formData.offreProduitService}

**ICP/CIBLE :** ${formData.icpCible}

**PAIN POINTS :** ${formData.painPoints}

**NOMBRE D'EMAILS :** ${formData.nombreEmails}

**TONALITÉ/STYLE :** ${formData.tonaliteStyle}

**CALL-TO-ACTION ATTENDU :** ${formData.callToAction}`;

    if (formData.bonusContent?.trim()) {
      userPrompt += `\n\n**BONUS (témoignages, FAQ, objections) :** ${formData.bonusContent}`;
    }

    // Ajouter les données ICP si disponibles
    if (formData.icpData) {
      userPrompt += `\n\n**DONNÉES ICP DISPONIBLES :**
- Profil : ${formData.icpData.profilSociodemographique?.age}, ${formData.icpData.profilSociodemographique?.situationPro}
- Besoins : ${formData.icpData.psychologieMotivations?.besoins?.slice(0, 3).join(', ')}
- Peurs : ${formData.icpData.psychologieMotivations?.peurs?.slice(0, 3).join(', ')}
- Objections : ${formData.icpData.psychologieMotivations?.objections?.slice(0, 2).join(', ')}
- Messaging efficace : ${formData.icpData.messagingImpactant?.expressions?.slice(0, 3).join(', ')}`;
    }

    // Ajouter les données USP si disponibles
    if (formData.uspData) {
      userPrompt += `\n\n**USP DISPONIBLE :**
- USP principale : ${formData.uspData.uspPrincipale}
- Variantes : ${formData.uspData.variantes?.emotionnel}
- Conseils utilisation : ${formData.uspData.conseilUtilisation?.emailMarketing}`;
    }

    // Ajouter les données Tunnel si disponibles
    if (formData.tunnelData) {
      userPrompt += `\n\n**TUNNEL DE VENTE :**
- Structure : ${formData.tunnelData.schemaTunnel?.etapes?.join(' > ')}
- Séquence email prévue : ${formData.tunnelData.sequenceEmail?.description}`;
    }

    userPrompt += `\n\nFournis une séquence email complète selon le format JSON demandé.`;

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
      if (!analysis.sequenceInfo || !analysis.emails || !Array.isArray(analysis.emails)) {
        throw new Error('Format de réponse invalide');
      }

      // S'assurer qu'on a le bon nombre d'emails
      if (analysis.emails.length !== formData.nombreEmails) {
        // Ajuster si nécessaire
        if (analysis.emails.length > formData.nombreEmails) {
          analysis.emails = analysis.emails.slice(0, formData.nombreEmails);
        }
      }

      // Validation et normalisation des métriques
      analysis.emails.forEach((email: any, index: number) => {
        email.numeroEmail = index + 1;
        if (!email.metriquesEstimees) {
          email.metriquesEstimees = {
            tauxOuverture: 25,
            tauxClic: 5,
            tauxConversion: 1
          };
        }
      });

      // Validation des métriques globales
      if (!analysis.metriquesGlobales) {
        analysis.metriquesGlobales = {
          tauxOuvertureEstime: 25,
          tauxClicEstime: 5,
          tauxConversionEstime: 1,
          revenusEstimes: "À calculer"
        };
      }

      // Validation des conseils généraux
      if (!analysis.conseilsGeneraux) {
        analysis.conseilsGeneraux = {
          segmentation: ["Segmentez par niveau d'engagement"],
          automatisation: ["Utilisez des tags comportementaux"],
          optimisation: ["Testez différents horaires d'envoi"],
          delivrabilite: ["Évitez les mots spam"]
        };
      }

      // Validation des outils et prochaines étapes
      if (!Array.isArray(analysis.outilsRecommandes)) {
        analysis.outilsRecommandes = ["Mailchimp", "ActiveCampaign", "ConvertKit"];
      }

      if (!Array.isArray(analysis.prochainEtapes)) {
        analysis.prochainEtapes = [
          "Configurer la séquence dans votre outil email",
          "Créer les landing pages associées",
          "Mettre en place le tracking"
        ];
      }

      return NextResponse.json({
        success: true,
        analysis,
        processingTime: Date.now()
      });

    } catch (error) {
      console.error('Erreur OpenAI lors de la génération des emails:', error);
      
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
      
      throw new Error(`Erreur lors de la génération des emails avec OpenAI: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

  } catch (error) {
    console.error('Erreur lors de la génération de la séquence email:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération de la séquence email',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 