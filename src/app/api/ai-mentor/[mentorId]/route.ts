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
        temperature: 0.3, // Réduit pour plus de cohérence
        top_p: 0.9, // Réduit pour plus de focus
        frequency_penalty: 0.1, // Évite les répétitions
        presence_penalty: 0.1, // Encourage la diversité
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API IA: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';
  } catch (error) {
    // Logging détaillé des erreurs API
    console.error('=== ERREUR API IA ===');
    console.error('Message utilisateur:', messages[messages.length - 1]?.content?.substring(0, 100) + '...');
    console.error('Configuration AI:', { model: DEFAULT_MODEL, url: AI_API_URL });
    console.error('Erreur détaillée:', error);
    console.error('Timestamp:', new Date().toISOString());
    console.error('==================');
    
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

// Fonction pour détecter les salutations et messages courts
function isGreetingOrShortMessage(message: string): boolean {
  const cleanMessage = message.toLowerCase().trim();
  
  // Salutations courantes
  const greetings = [
    'bonjour', 'bonsoir', 'salut', 'hello', 'hi', 'hey', 'coucou',
    'bonne journée', 'bonne soirée', 'bon matin', 'good morning',
    'good evening', 'good afternoon', 'ça va', 'comment allez-vous',
    'comment ça va', 'how are you', 'comment vous allez'
  ];
  
  // Vérifier si c'est une salutation exacte
  if (greetings.some(greeting => cleanMessage === greeting || cleanMessage === greeting + '!' || cleanMessage === greeting + '?')) {
    return true;
  }
  
  // Vérifier si le message est très court (moins de 10 caractères) et ne contient pas de question spécifique
  if (cleanMessage.length <= 10 && !cleanMessage.includes('?') && !cleanMessage.includes('comment') && !cleanMessage.includes('quoi') && !cleanMessage.includes('pourquoi')) {
    return true;
  }
  
  return false;
}

// Fonction pour générer une réponse de salutation personnalisée selon le mentor
function generateGreetingResponse(mentorId: string): string {
  const greetingResponses: Record<string, string[]> = {
    'copy-mentor': [
      "Bonjour ! Je suis votre Copy Mentor, expert en rédaction persuasive. Comment puis-je vous aider à créer des textes qui convertissent aujourd'hui ?",
      "Salut ! Prêt à booster vos conversions avec du copywriting efficace ? Que souhaitez-vous améliorer ?",
      "Hello ! Votre Copy Mentor est là pour vous aider. Avez-vous un projet de rédaction en cours ?"
    ],
    'content-mentor': [
      "Bonjour ! Je suis votre Content Mentor, spécialiste des réseaux sociaux. Sur quelle plateforme souhaitez-vous développer votre présence ?",
      "Salut ! Prêt à créer du contenu viral ? Dites-moi quel est votre défi actuel en création de contenu.",
      "Hello ! Votre expert en stratégie de contenu est là. Quelle est votre audience cible ?"
    ],
    'funnel-mentor': [
      "Bonjour ! Je suis votre Funnel Mentor, expert en tunnels de vente. Quel est votre taux de conversion actuel ?",
      "Salut ! Prêt à optimiser votre tunnel de vente ? Où se situent vos points de friction ?",
      "Hello ! Votre spécialiste en optimisation de parcours client est là. Quel produit souhaitez-vous promouvoir ?"
    ],
    'business-mentor': [
      "Bonjour ! Je suis votre Business Mentor, conseiller en stratégie d'entreprise. Quel défi business puis-je vous aider à résoudre ?",
      "Salut ! Prêt à développer votre entreprise ? Parlez-moi de votre projet actuel.",
      "Hello ! Votre expert en stratégie business est là. À quelle étape en êtes-vous dans votre développement ?"
    ],
    'video-mentor': [
      "Bonjour ! Je suis votre Video Mentor, créateur de scripts engageants. Pour quelle plateforme créez-vous du contenu vidéo ?",
      "Salut ! Prêt à créer des vidéos qui cartonnent ? Quel type de contenu souhaitez-vous développer ?",
      "Hello ! Votre expert en création vidéo est là. Avez-vous une idée de script en tête ?"
    ],
    'email-mentor': [
      "Bonjour ! Je suis votre Email Mentor, spécialiste en marketing par email. Quel est votre taux d'ouverture actuel ?",
      "Salut ! Prêt à booster vos campagnes email ? Quelle séquence souhaitez-vous optimiser ?",
      "Hello ! Votre expert en email marketing est là. Travaillez-vous sur une newsletter ou des séquences automatisées ?"
    ]
  };
  
  const responses = greetingResponses[mentorId] || [
    "Bonjour ! Je suis votre mentor IA. Comment puis-je vous aider aujourd'hui ?",
    "Salut ! Prêt à travailler ensemble ? Dites-moi ce que vous souhaitez accomplir.",
    "Hello ! Votre mentor est là pour vous accompagner. Quel est votre objectif ?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
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

    let aiResponse: string;

    // Vérifier si c'est une salutation ou un message court
    if (isGreetingOrShortMessage(cleanMessage)) {
      // Répondre directement avec une salutation personnalisée
      aiResponse = generateGreetingResponse(mentorId);
      console.log(`Salutation détectée pour ${mentorId}: "${cleanMessage}" -> Réponse directe`);
    } else {
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
      aiResponse = await callAI(messages);
    }

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