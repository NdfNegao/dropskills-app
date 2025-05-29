import OpenAI from 'openai';

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Export nommé pour compatibilité
export { openai };

// Types pour les réponses
export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Configuration des modèles par outil
export const AI_MODELS = {
  icp: 'gpt-4o-mini', // Analyse complexe
  titles: 'gpt-3.5-turbo', // Génération rapide
  descriptions: 'gpt-3.5-turbo', // Textes courts
  emails: 'gpt-4o-mini', // Copywriting avancé
  offers: 'gpt-4o-mini', // Stratégie commerciale
  content: 'gpt-4o-mini', // Planning complexe
  usp: 'gpt-3.5-turbo', // Propositions courtes
} as const;

// Fonction générique de génération
export async function generateAIContent(
  prompt: string,
  model: keyof typeof AI_MODELS | string = 'titles',
  temperature: number = 0.7,
  maxTokens: number = 1000
): Promise<AIResponse> {
  try {
    const modelName = typeof model === 'string' && model in AI_MODELS 
      ? AI_MODELS[model as keyof typeof AI_MODELS]
      : model;

    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en marketing digital et copywriting. Réponds toujours en français avec un ton professionnel et engageant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens: maxTokens,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage ? {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
      } : undefined
    };
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    throw new Error('Erreur lors de la génération IA');
    }
}

// Fonction avec streaming (pour l'affichage en temps réel)
export async function generateAIContentStream(
  prompt: string,
  model: keyof typeof AI_MODELS | string = 'titles',
  temperature: number = 0.7
) {
  try {
    const modelName = typeof model === 'string' && model in AI_MODELS 
      ? AI_MODELS[model as keyof typeof AI_MODELS]
      : model;

    const stream = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en marketing digital et copywriting. Réponds toujours en français avec un ton professionnel et engageant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error('Erreur OpenAI Stream:', error);
    throw new Error('Erreur lors de la génération IA');
  }
}

export default openai;

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
  const client = openai;
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
    const completion = await client.chat.completions.create({
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