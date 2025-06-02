import { NextRequest, NextResponse } from 'next/server';
import { generateAIContentWithProvider } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { subject, audience, tone, type } = await request.json();

    // Validation des données
    if (!subject) {
      return NextResponse.json(
        { error: 'Le sujet est requis' },
        { status: 400 }
      );
    }

    // Construction du prompt optimisé
    const prompt = buildTitlesPrompt({ subject, audience, tone, type });

    // Génération avec routage intelligent (DeepSeek prioritaire)
    const response = await generateAIContentWithProvider(
      prompt, 
      'titles', 
      0.8, 
      800,
      'Tu es un expert en copywriting et marketing digital. Génère des titres accrocheurs et optimisés pour le web en français.'
    );

    // Parsing des titres (format JSON attendu)
    let titles: string[] = [];
    try {
      const parsed = JSON.parse(response.content);
      titles = parsed.titles || [];
    } catch {
      // Fallback: split par lignes si pas JSON
      titles = response.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(title => title.length > 0)
        .slice(0, 8);
    }

    return NextResponse.json({
      titles,
      usage: response.usage,
      provider: response.provider,
      costSavings: response.costSavings
    });

  } catch (error) {
    console.error('Erreur génération titres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des titres' },
      { status: 500 }
    );
  }
}

function buildTitlesPrompt({ subject, audience, tone, type }: {
  subject: string;
  audience?: string;
  tone: string;
  type: string;
}) {
  const audienceText = audience ? ` pour ${audience}` : '';
  const typeText = getTypeDescription(type);
  const toneText = getToneDescription(tone);

  return `Génère 8 titres ${toneText} pour ${typeText} sur le sujet "${subject}"${audienceText}.

CONTRAINTES:
- Titres en français
- Maximum 80 caractères par titre
- Utilise des émojis pertinents
- Varie les structures (questions, affirmations, listes)
- Optimisés pour le clic et l'engagement

STYLE ${tone.toUpperCase()}:
${getToneGuidelines(tone)}

FORMAT DE RÉPONSE (JSON uniquement):
{
  "titles": [
    "🚀 Titre 1 ici",
    "💡 Titre 2 ici",
    "..."
  ]
}`;
}

function getTypeDescription(type: string): string {
  const types = {
    'article': 'un article de blog',
    'video': 'une vidéo YouTube',
    'email': 'un email marketing',
    'social': 'un post sur les réseaux sociaux'
  };
  return types[type as keyof typeof types] || 'un contenu';
}

function getToneDescription(tone: string): string {
  const tones = {
    'accrocheur': 'accrocheurs et impactants',
    'professionnel': 'professionnels et crédibles',
    'emotionnel': 'émotionnels et engageants',
    'urgent': 'urgents et persuasifs'
  };
  return tones[tone as keyof typeof tones] || 'engageants';
}

function getToneGuidelines(tone: string): string {
  const guidelines = {
    'accrocheur': '- Utilise des mots puissants (révolutionnaire, secret, incroyable)\n- Crée de la curiosité\n- Promets un bénéfice clair',
    'professionnel': '- Ton sérieux et expert\n- Évite les superlatifs excessifs\n- Focus sur la valeur et les résultats',
    'emotionnel': '- Connecte avec les émotions (peur, désir, espoir)\n- Utilise "vous" pour personnaliser\n- Évoque des situations concrètes',
    'urgent': '- Crée un sentiment d\'urgence\n- Utilise des mots d\'action\n- Évoque la rareté ou le temps limité'
  };
  return guidelines[tone as keyof typeof guidelines] || 'Sois engageant et pertinent';
}