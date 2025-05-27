import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { ICPFormData } from '@/app/outils/icp-maker/page';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData: ICPFormData = await request.json();
    
    // Validation des données
    if (!formData.secteur?.trim() || !formData.produitService?.trim()) {
      return NextResponse.json(
        { error: 'Les champs secteur et produit/service sont requis' },
        { status: 400 }
      );
    }

    // Prompt système optimisé pour l'ICP
    const systemPrompt = `Tu es un expert en stratégie marketing, persona et IA.
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

Sois concis, opérationnel, sans bullshit, et mets-toi à la place d'un marketer qui doit vendre demain matin.`;

    const userPrompt = `Analyse ce business pour créer l'ICP parfait :

**SECTEUR D'ACTIVITÉ / MARCHÉ :** ${formData.secteur}

**PRODUIT/SERVICE :** ${formData.produitService}

**PROMESSE UNIQUE :** ${formData.promesseUnique}

**BUDGET CIBLE DU CLIENT :** ${formData.budgetCible}

**CANAUX ENVISAGÉS :** ${formData.canaux.join(', ')}

**ZONE GÉOGRAPHIQUE :** ${formData.zoneGeographique}

**TONALITÉ SOUHAITÉE :** ${formData.tonalite}

Fournis une analyse ICP complète selon le format JSON demandé.`;

    try {
      const completion = await openai().chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('Aucune réponse reçue de OpenAI');
      }

      const analysis = JSON.parse(response);

      // Validation de la structure de réponse
      if (!analysis.profilSociodemographique || !analysis.psychologieMotivations) {
        throw new Error('Format de réponse invalide');
      }

      return NextResponse.json({
        success: true,
        analysis,
        processingTime: Date.now()
      });

    } catch (error) {
      console.error('Erreur OpenAI lors de la génération ICP:', error);
      
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
      
      throw new Error(`Erreur lors de la génération ICP avec OpenAI: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

  } catch (error) {
    console.error('Erreur lors de la génération ICP:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération de l\'ICP',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 