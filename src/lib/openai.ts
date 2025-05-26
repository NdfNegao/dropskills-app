import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface IdeaGenerationRequest {
  targetAudience: string;
  topic?: string;
  formats?: string[];
}

export interface GeneratedIdea {
  title: string;
  description: string;
  targetAudience: string;
  marketSize: string;
  difficulty: 'FACILE' | 'MOYEN' | 'DIFFICILE';
  revenueEstimate: string;
  keyFeatures: string[];
  marketingStrategy: string;
  confidence: number;
  tags: string[];
  category: string;
}

export async function generateProductIdeas(request: IdeaGenerationRequest): Promise<GeneratedIdea[]> {
  const { targetAudience, topic, formats } = request;
  
  // Construction du prompt optimisé
  const systemPrompt = `Tu es un expert en création de produits digitaux et en business en ligne. 
Tu dois générer des idées de produits digitaux innovantes et rentables basées sur les critères fournis.

Pour chaque idée, tu dois fournir :
- Un titre accrocheur et spécifique
- Une description détaillée (2-3 phrases)
- L'audience cible exacte
- La taille du marché estimée
- Le niveau de difficulté (FACILE/MOYEN/DIFFICILE)
- Une estimation de revenus réaliste
- 4-6 fonctionnalités clés
- Une stratégie marketing adaptée
- Un score de confiance (0.6-0.95)
- 3-5 tags pertinents
- Une catégorie principale

Réponds UNIQUEMENT avec un JSON valide contenant un tableau "ideas" avec exactement 3-4 idées.`;

  const userPrompt = `Génère des idées de produits digitaux pour :

AUDIENCE CIBLE : ${targetAudience}
${topic ? `SUJET/DOMAINE : ${topic}` : ''}
${formats && formats.length > 0 ? `FORMATS PRÉFÉRÉS : ${formats.join(', ')}` : ''}

Assure-toi que les idées sont :
- Spécifiquement adaptées à cette audience
- Réalisables avec les ressources d'un entrepreneur solo/petit équipe
- Basées sur des besoins réels du marché
- Différenciées entre elles (différents niveaux de complexité)
${formats && formats.length > 0 ? `- Privilégiant les formats : ${formats.join(', ')}` : ''}`;

  try {
    const completion = await openai.chat.completions.create({
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

    const parsedResponse = JSON.parse(response);
    
    if (!parsedResponse.ideas || !Array.isArray(parsedResponse.ideas)) {
      throw new Error('Format de réponse invalide');
    }

    // Validation et nettoyage des idées
    const validatedIdeas: GeneratedIdea[] = parsedResponse.ideas.map((idea: any) => ({
      title: idea.title || 'Titre non défini',
      description: idea.description || 'Description non définie',
      targetAudience: idea.targetAudience || targetAudience,
      marketSize: idea.marketSize || 'Marché de niche',
      difficulty: ['FACILE', 'MOYEN', 'DIFFICILE'].includes(idea.difficulty) 
        ? idea.difficulty 
        : 'MOYEN',
      revenueEstimate: idea.revenueEstimate || '500-2000€/mois',
      keyFeatures: Array.isArray(idea.keyFeatures) 
        ? idea.keyFeatures 
        : ['Fonctionnalité 1', 'Fonctionnalité 2'],
      marketingStrategy: idea.marketingStrategy || 'Marketing digital ciblé',
      confidence: typeof idea.confidence === 'number' 
        ? Math.max(0.6, Math.min(0.95, idea.confidence))
        : 0.75,
      tags: Array.isArray(idea.tags) ? idea.tags : [],
      category: idea.category || topic || 'Business'
    }));

    return validatedIdeas;

  } catch (error) {
    console.error('Erreur OpenAI:', error);
    
    // Fallback en cas d'erreur
    throw new Error(`Erreur lors de la génération avec OpenAI: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
} 