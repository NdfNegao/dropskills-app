import { NextRequest, NextResponse } from 'next/server';
import { generateAIContentWithProvider } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { productName, category, targetAudience, features, benefits, tone } = await request.json();

    // Validation des données
    if (!productName || !category) {
      return NextResponse.json(
        { error: 'Le nom du produit et la catégorie sont requis' },
        { status: 400 }
      );
    }

    // Construction du prompt optimisé
    const prompt = buildDescriptionsPrompt({ 
      productName, 
      category, 
      targetAudience, 
      features, 
      benefits, 
      tone 
    });

    // Génération avec OpenAI
    const response = await generateAIContentWithProvider(
      prompt, 
      'descriptions', 
      0.8, 
      1000,
      'Tu es un expert en copywriting et marketing digital. Crée des descriptions produits persuasives et optimisées SEO en français.'
    );

    // Parsing des descriptions (format JSON attendu)
    let descriptions: string[] = [];
    try {
      const parsed = JSON.parse(response.content);
      descriptions = parsed.descriptions || [];
    } catch {
      // Fallback: split par lignes si pas JSON
      descriptions = response.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(desc => desc.length > 50) // Descriptions minimum 50 caractères
        .slice(0, 5);
    }

    return NextResponse.json({
      descriptions,
      usage: response.usage,
      provider: response.provider,
      costSavings: response.costSavings
    });

  } catch (error) {
    console.error('Erreur génération descriptions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des descriptions' },
      { status: 500 }
    );
  }
}

function buildDescriptionsPrompt({ 
  productName, 
  category, 
  targetAudience, 
  features, 
  benefits, 
  tone 
}: {
  productName: string;
  category: string;
  targetAudience?: string;
  features?: string;
  benefits?: string;
  tone?: string;
}) {
  const audienceText = targetAudience ? ` pour ${targetAudience}` : '';
  const featuresText = features ? `\nFonctionnalités clés : ${features}` : '';
  const benefitsText = benefits ? `\nBénéfices : ${benefits}` : '';
  const toneText = tone ? getToneDescription(tone) : 'professionnelles et engageantes';

  return `Génère 5 descriptions ${toneText} pour le produit "${productName}" dans la catégorie ${category}${audienceText}.

INFORMATIONS PRODUIT:
- Nom : ${productName}
- Catégorie : ${category}${featuresText}${benefitsText}
- Audience cible : ${targetAudience || 'Grand public'}

CONTRAINTES:
- Descriptions en français
- Entre 80 et 150 mots par description
- Utilise des émojis pertinents (2-3 par description)
- Varie les angles d'approche (bénéfices, fonctionnalités, émotions, résultats)
- Optimisées pour la conversion
- Inclus des mots-clés pertinents pour le SEO

STYLE ${(tone || 'professionnel').toUpperCase()}:
${getToneGuidelines(tone || 'professionnel')}

FORMAT DE RÉPONSE (JSON uniquement):
{
  "descriptions": [
    "🚀 Description 1 complète ici...",
    "💡 Description 2 complète ici...",
    "✨ Description 3 complète ici...",
    "🎯 Description 4 complète ici...",
    "⭐ Description 5 complète ici..."
  ]
}`;
}

function getToneDescription(tone: string): string {
  const tones = {
    'professionnel': 'professionnelles et crédibles',
    'commercial': 'commerciales et persuasives',
    'emotionnel': 'émotionnelles et engageantes',
    'technique': 'techniques et détaillées',
    'casual': 'décontractées et accessibles'
  };
  return tones[tone as keyof typeof tones] || 'professionnelles et engageantes';
}

function getToneGuidelines(tone: string): string {
  const guidelines = {
    'professionnel': '- Ton expert et crédible\n- Focus sur la qualité et les résultats\n- Évite les superlatifs excessifs\n- Utilise un vocabulaire précis',
    'commercial': '- Ton persuasif et orienté vente\n- Crée de l\'urgence et du désir\n- Met en avant les bénéfices clients\n- Utilise des preuves sociales',
    'emotionnel': '- Connecte avec les émotions\n- Raconte une histoire\n- Évoque des situations concrètes\n- Utilise "vous" pour personnaliser',
    'technique': '- Détaille les spécifications\n- Utilise un vocabulaire technique\n- Explique le fonctionnement\n- Met en avant l\'innovation',
    'casual': '- Ton décontracté et amical\n- Utilise un langage simple\n- Évite le jargon technique\n- Reste accessible à tous'
  };
  return guidelines[tone as keyof typeof guidelines] || 'Sois professionnel et engageant';
}