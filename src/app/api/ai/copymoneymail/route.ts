import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { objectif, produitService, audience, problemes, nombreEmails, tonalite, cta } = body;

    if (!objectif?.trim() || !produitService?.trim()) {
      return NextResponse.json(
        { error: 'Les champs objectif et produit/service sont requis' },
        { status: 400 }
      );
    }

    const systemPrompt = `Tu es un expert en copywriting et email marketing.
Génère une séquence d'emails professionnels et percutants basée sur les informations fournies.
Réponds UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure :

{
  "informationsGenerales": {
    "objectifPrincipal": "Objectif résumé",
    "dureeSequence": "Ex: 7 jours",
    "frequenceEnvoi": "Ex: 1 email tous les 2 jours",
    "tonaliteGlobale": "Tonalité appliquée"
  },
  "metriquesEstimees": {
    "tauxOuverture": "Ex: 35-45%",
    "tauxClic": "Ex: 8-12%",
    "tauxConversion": "Ex: 2-4%",
    "roiEstime": "Ex: 3-5x"
  },
  "emails": [
    {
      "sujet": "Objet de l'email",
      "contenu": "Corps complet de l'email avec storytelling, valeur et appel à l'action",
      "cta": "Texte du bouton d'action",
      "conseils": ["Conseil d'optimisation 1", "Conseil 2"]
    }
  ]
}`;

    const userPrompt = `Génère une séquence de ${nombreEmails || '5 emails'} pour ce business :

OBJECTIF : ${objectif}
PRODUIT/SERVICE : ${produitService}
AUDIENCE CIBLE : ${audience || 'Non précisée'}
PROBLÈMES À RÉSOUDRE : ${problemes || 'Non précisés'}
TONALITÉ : ${tonalite || 'Professionnel et expert'}
APPEL À L'ACTION : ${cta || 'En savoir plus'}

Adapte chaque email pour guider progressivement le lecteur vers l'action finale.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('Aucune réponse reçue');
    }

    const result = JSON.parse(response);

    if (!result.informationsGenerales || !result.emails || !Array.isArray(result.emails)) {
      throw new Error('Format de réponse invalide');
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erreur génération séquence email:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la génération de la séquence email',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
