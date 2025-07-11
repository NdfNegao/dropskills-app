import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIProviderManager } from '@/lib/ai-providers';

export const dynamic = 'force-dynamic';

// Correction du typage pour les données d'entrée
interface ContentSystemRequest {
  business: string;
  audience: string;
  goals: string[];
  platforms: string[];
  frequency: string;
  tone: string;
}

// Correction du typage de l'utilisateur pour inclure le rôle
interface UserWithRole {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
}

// Fonction utilitaire pour vérifier l'accès premium
async function checkPremiumAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: 'Non authentifié', status: 401 };
  }
  const user = session.user as UserWithRole;
  // TEMPORAIRE: Accès ouvert à tous pour le lancement
  // if (!['PREMIUM', 'ADMIN'].includes(user.role || '')) {
  //   return { error: 'Accès premium requis', status: 403 };
  // }
  return { user };
}

// Générateur de prompt pour le plan de contenu
function buildContentSystemPrompt(data: ContentSystemRequest) {
  const { business, audience, goals, platforms, frequency, tone } = data;
  return `Tu es un expert en stratégie de contenu digital.

MISSION : Génère un plan de contenu détaillé pour une entreprise de type "${business}".
AUDIENCE CIBLE : ${audience}
OBJECTIFS : ${goals.join(', ')}
PLATEFORMES : ${platforms.join(', ')}
FRÉQUENCE : ${frequency}
TON : ${tone}

FORMAT ATTENDU :
Retourne un tableau JSON de 4 semaines, chaque semaine contient une liste d'objets avec :
- platform (plateforme)
- type (type de contenu)
- title (titre accrocheur)
- description (résumé ou angle du post)
- hashtags (3 à 6 hashtags pertinents)

Exemple :
[
  {
    "week": 1,
    "content": [
      { "platform": "Instagram", "type": "Reel", "title": "Titre...", "description": "...", "hashtags": ["#business", "#motivation"] },
      ...
    ]
  },
  ...
]

Sois créatif, varie les types de contenus, adapte les titres à chaque plateforme et objectif. Utilise un ton ${tone}.`;
}

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'accès premium
    const accessCheck = await checkPremiumAccess();
    if (accessCheck.error) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }

    // Validation des données d'entrée
    const data: ContentSystemRequest = await request.json();
    // Validation stricte des champs requis
    if (!data.business || !data.audience || !Array.isArray(data.goals) || data.goals.length === 0 || !Array.isArray(data.platforms) || data.platforms.length === 0) {
      return NextResponse.json(
        { error: 'Champs requis manquants ou invalides' },
        { status: 400 }
      );
    }

    // Génération du prompt
    const prompt = buildContentSystemPrompt(data);

    // Sélection du provider optimal (type 'content')
    let provider, aiResponse, parsedPlan;
    try {
      provider = await AIProviderManager.getOptimalProvider('content');
      aiResponse = await provider.generateText(prompt, { temperature: 0.7, maxTokens: 2000 });
      // Essayer de parser la réponse IA en JSON
      parsedPlan = JSON.parse(aiResponse);
    } catch (err) {
      // Fallback : message d’erreur explicite
      return NextResponse.json(
        { error: 'Erreur IA ou parsing du plan de contenu', details: err instanceof Error ? err.message : String(err) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      contentPlan: parsedPlan,
      metadata: {
        business: data.business,
        audience: data.audience,
        platforms: data.platforms,
        frequency: data.frequency,
        provider: provider?.name,
        model: provider?.model,
        generatedAt: new Date().toISOString(),
        weeksGenerated: 4
      }
    });
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}