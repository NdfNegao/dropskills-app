import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { USPFormData } from '@/app/outils/usp-maker/page';

export const dynamic = 'force-dynamic';

interface USPRequestData extends USPFormData {
  icpData?: any;
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

    const formData: USPRequestData = await request.json();
    
    // Validation des données
    if (!formData.resultatPromesse?.trim() || !formData.problemePrincipal?.trim()) {
      return NextResponse.json(
        { error: 'Les champs résultat/promesse et problème principal sont requis' },
        { status: 400 }
      );
    }

    // Prompt système optimisé pour l'USP
    const systemPrompt = `Tu es expert en copywriting, marketing et différenciation business.
À partir des infos suivantes, génère l'USP la plus percutante et irrésistible possible (promesse unique de vente) pour ce business.

Tu dois répondre UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure :

{
  "uspPrincipale": "USP principale en une phrase impactante, claire, magnétique, adaptée à la cible, pas bullshit",
  "variantes": {
    "rationnel": "Variante avec angle rationnel/logique",
    "emotionnel": "Variante avec angle émotionnel/aspirationnel", 
    "exclusif": "Variante avec angle exclusivité/urgence"
  },
  "explication": {
    "pourquoi": "Explication rapide pourquoi ce positionnement va convertir",
    "differenciateur": "Le vrai différenciateur identifié",
    "impact": "Impact attendu sur les conversions"
  },
  "conseilUtilisation": {
    "pageSale": "Comment utiliser sur une page de vente",
    "publicite": "Comment utiliser dans une pub",
    "reseauxSociaux": "Comment adapter pour les réseaux sociaux",
    "emailMarketing": "Comment utiliser en email marketing"
  },
  "metriques": {
    "scoreImpact": 85,
    "memorabilite": 90,
    "clarte": 88
  }
}

Contraintes :
- Ne copie pas les concurrents, cherche le vrai différenciateur
- USP < 20 mots si possible, simple et mémorable
- Reste fidèle au ton demandé par l'utilisateur
- Sois concret, pas bullshit, orienté résultats`;

    // Construction du prompt utilisateur avec les données ICP si disponibles
    let userPrompt = `Génère l'USP parfaite pour ce business :

**RÉSULTAT/PROMESSE :** ${formData.resultatPromesse}

**PROBLÈME PRINCIPAL :** ${formData.problemePrincipal}

**DIFFÉRENCE PRINCIPALE/OFFRE UNIQUE :** ${formData.differenceUnique}

**PREUVE/ARGUMENT PHARE :** ${formData.preuveArgument}

**CONCURRENTS :** ${formData.concurrents}

**CLIENT IDÉAL :** ${formData.clientIdeal}

**TONALITÉ :** ${formData.tonalite}`;

    if (formData.contraintes?.trim()) {
      userPrompt += `\n\n**CONTRAINTES OPTIONNELLES :** ${formData.contraintes}`;
    }

    // Ajouter les données ICP si disponibles
    if (formData.icpData) {
      userPrompt += `\n\n**DONNÉES ICP DISPONIBLES :**
- Profil client : ${formData.icpData.profilSociodemographique?.age}, ${formData.icpData.profilSociodemographique?.situationPro}
- Problèmes identifiés : ${formData.icpData.problemePrincipaux?.slice(0, 3).join(', ')}
- Messaging efficace : ${formData.icpData.messagingImpactant?.expressions?.slice(0, 3).join(', ')}
- Budget typique : ${formData.icpData.budgetPouvoirAchat?.budgetTypique}`;
    }

    userPrompt += `\n\nFournis une USP complète selon le format JSON demandé.`;

    try {
      const openaiClient = openai();
      
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2500,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('Aucune réponse reçue de OpenAI');
      }

      const analysis = JSON.parse(response);

      // Validation de la structure de réponse
      if (!analysis.uspPrincipale || !analysis.variantes || !analysis.explication) {
        throw new Error('Format de réponse invalide');
      }

      // Validation des métriques (scores entre 0 et 100)
      if (analysis.metriques) {
        analysis.metriques.scoreImpact = Math.min(100, Math.max(0, analysis.metriques.scoreImpact || 75));
        analysis.metriques.memorabilite = Math.min(100, Math.max(0, analysis.metriques.memorabilite || 75));
        analysis.metriques.clarte = Math.min(100, Math.max(0, analysis.metriques.clarte || 75));
      } else {
        analysis.metriques = {
          scoreImpact: 75,
          memorabilite: 75,
          clarte: 75
        };
      }

      return NextResponse.json({
        success: true,
        analysis,
        processingTime: Date.now()
      });

    } catch (error) {
      console.error('Erreur OpenAI lors de la génération USP:', error);
      
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
      
      throw new Error(`Erreur lors de la génération USP avec OpenAI: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

  } catch (error) {
    console.error('Erreur lors de la génération USP:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération de l\'USP',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 