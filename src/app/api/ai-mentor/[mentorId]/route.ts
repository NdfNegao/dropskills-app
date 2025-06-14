import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MENTOR_PROMPTS } from '@/data/ai-mentors';

// Configuration pour les services IA
const getAIConfig = () => {
  // Priorité : Grok > DeepSeek > OpenAI
  if (process.env.GROK_API_KEY) {
    return {
      url: process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions',
      key: process.env.GROK_API_KEY,
      model: 'grok-2-1212'
    };
  }
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      url: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
      key: process.env.DEEPSEEK_API_KEY,
      model: 'deepseek-reasoner' // DeepSeek R1
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      url: process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions',
      key: process.env.OPENAI_API_KEY,
      model: 'gpt-4'
    };
  }
  return null;
};

const aiConfig = getAIConfig();
const AI_API_URL = aiConfig?.url;
const AI_API_KEY = aiConfig?.key;
const DEFAULT_MODEL = aiConfig?.model || 'grok-2-1212';

// Interface pour les messages
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Fonction pour appeler l'API IA
async function callAI(messages: ChatMessage[]): Promise<string> {
  try {
    // Si pas de clé API configurée, retourner une réponse simulée
    if (!AI_API_KEY) {
      console.warn('Clé API IA non configurée, utilisation d\'une réponse simulée');
      return generateMockResponse(messages[messages.length - 1].content);
    }

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API IA: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API IA:', error);
    return generateMockResponse(messages[messages.length - 1].content);
  }
}

// Fonction pour générer une réponse simulée
function generateMockResponse(userMessage: string): string {
  const responses = [
    `Excellente question ! Voici mon analyse de votre demande : "${userMessage.substring(0, 50)}...". Je vous recommande de commencer par définir clairement vos objectifs et votre audience cible.`,
    `Merci pour cette question pertinente. Pour répondre à "${userMessage.substring(0, 50)}...", je suggère une approche structurée en 3 étapes : 1) Analyse de la situation actuelle, 2) Définition de la stratégie, 3) Plan d'action concret.`,
    `C'est un point crucial que vous soulevez. Concernant "${userMessage.substring(0, 50)}...", voici mes recommandations basées sur les meilleures pratiques du secteur...`,
    `Parfait ! Cette question montre que vous êtes sur la bonne voie. Pour "${userMessage.substring(0, 50)}...", laissez-moi vous partager une stratégie éprouvée qui a fait ses preuves.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Fonction pour valider et nettoyer l'input utilisateur
function sanitizeInput(input: string): string {
  return input.trim().substring(0, 2000); // Limiter à 2000 caractères
}

// Fonction pour obtenir l'historique des conversations (à implémenter avec une base de données)
async function getConversationHistory(userId: string, mentorId: string): Promise<ChatMessage[]> {
  // TODO: Implémenter la récupération de l'historique depuis la base de données
  // Pour l'instant, on retourne un tableau vide
  return [];
}

// Fonction pour sauvegarder la conversation (à implémenter avec une base de données)
async function saveConversation(userId: string, mentorId: string, userMessage: string, aiResponse: string): Promise<void> {
  // TODO: Implémenter la sauvegarde en base de données
  console.log(`Conversation sauvegardée - User: ${userId}, Mentor: ${mentorId}`);
}

export async function POST(request: NextRequest, { params }: { params: { mentorId: string } }) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier l'accès premium
    const user = session.user as any;
    if (!user.premium && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès premium requis' },
        { status: 403 }
      );
    }

    const { mentorId } = params;
    const body = await request.json();
    const { message, userId } = body;

    // Validation des données
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    if (!mentorId || typeof mentorId !== 'string') {
      return NextResponse.json(
        { error: 'ID du mentor requis' },
        { status: 400 }
      );
    }

    // Vérifier que le mentor existe
    const mentorPrompt = MENTOR_PROMPTS[mentorId];
    if (!mentorPrompt) {
      return NextResponse.json(
        { error: 'Mentor non trouvé' },
        { status: 404 }
      );
    }

    // Nettoyer l'input utilisateur
    const cleanMessage = sanitizeInput(message);

    // Récupérer l'historique de conversation
    const conversationHistory = await getConversationHistory(user.id, mentorId);

    // Construire les messages pour l'IA
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: mentorPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: cleanMessage
      }
    ];

    // Appeler l'IA
    const aiResponse = await callAI(messages);

    // Sauvegarder la conversation
    await saveConversation(user.id, mentorId, cleanMessage, aiResponse);

    // Retourner la réponse
    return NextResponse.json({
      response: aiResponse,
      mentorId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur dans l\'API mentor:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Endpoint pour récupérer l'historique des conversations
export async function GET(request: NextRequest, { params }: { params: { mentorId: string } }) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    const { mentorId } = params;

    // Récupérer l'historique
    const history = await getConversationHistory(user.id, mentorId);

    return NextResponse.json({
      history,
      mentorId
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}