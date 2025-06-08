import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { AI_PROVIDERS } from '@/lib/ai-providers';

export const dynamic = 'force-dynamic';

interface TestResult {
  success: boolean;
  responseTime: number;
  tokensUsed?: number;
  cost?: number;
  output?: string;
  error?: string;
  timestamp: string;
}

interface ToolTestRequest {
  toolId: string;
  testInput?: any;
  model?: string;
  provider?: string;
}

// POST /api/admin/ai-tools/test - Tester un outil IA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body: ToolTestRequest = await request.json();
    const { toolId, testInput, model, provider } = body;

    if (!toolId) {
      return NextResponse.json(
        { error: 'toolId est requis' },
        { status: 400 }
      );
    }

    // Récupérer les informations de l'outil
    const { data: tool, error: toolError } = await supabaseAdmin
      .from('ai_tools')
      .select('*, ai_tool_configurations(*)')
      .eq('id', toolId)
      .single();

    if (toolError || !tool) {
      return NextResponse.json(
        { error: 'Outil non trouvé' },
        { status: 404 }
      );
    }

    // Utiliser la configuration de l'outil ou les paramètres fournis
    const config = tool.ai_tool_configurations?.[0];
    const selectedModel = model || config?.model || 'gpt-3.5-turbo';
    const selectedProvider = provider || config?.provider || 'OpenAI';

    // Préparer les données de test
    const testData = testInput || getDefaultTestInput(tool.type);
    
    // Exécuter le test
    const testResult = await executeToolTest({
      tool,
      testData,
      model: selectedModel,
      provider: selectedProvider,
      config
    });

    // Enregistrer le résultat du test
    await logTestResult({
      toolId,
      userId: session.user.id,
      testResult,
      testInput: testData
    });

    return NextResponse.json({
      success: true,
      result: testResult
    });
  } catch (error) {
    console.error('Erreur test outil IA:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test de l\'outil' },
      { status: 500 }
    );
  }
}

// GET /api/admin/ai-tools/test - Récupérer l'historique des tests


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabaseAdmin
      .from('ai_tool_tests')
      .select(`
        *,
        ai_tools(name, type)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (toolId) {
      query = query.eq('tool_id', toolId);
    }

    const { data: tests, error } = await query;

    if (error) {
      console.error('Erreur récupération tests:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(tests || []);
  } catch (error) {
    console.error('Erreur récupération historique tests:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Fonction pour exécuter le test d'un outil
async function executeToolTest({
  tool,
  testData,
  model,
  provider,
  config
}: {
  tool: any;
  testData: any;
  model: string;
  provider: string;
  config?: any;
}): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    // Vérifier que le provider est disponible
    const aiProvider = AI_PROVIDERS[provider];
    if (!aiProvider || !aiProvider.isAvailable()) {
      throw new Error(`Provider ${provider} non disponible`);
    }

    // Construire le prompt basé sur le type d'outil
    const prompt = buildPromptForTool(tool, testData);
    
    // Paramètres de la requête
    const requestParams = {
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: config?.maxTokens || 1000,
      temperature: config?.temperature || 0.7,
      top_p: config?.topP || 1,
      frequency_penalty: config?.frequencyPenalty || 0,
      presence_penalty: config?.presencePenalty || 0
    };

    // Simuler l'appel à l'API (remplacer par l'appel réel)
    const response = await simulateAICall(requestParams, provider);
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      responseTime,
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      output: response.content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    };
  }
}

// Fonction pour construire le prompt selon le type d'outil
function buildPromptForTool(tool: any, testData: any): string {
  const basePrompt = tool.prompt || tool.system_prompt || '';
  
  switch (tool.type) {
    case 'ICP_MAKER':
      return `${basePrompt}\n\nEntreprise: ${testData.company || 'TechStart'}\nSecteur: ${testData.sector || 'Technologie'}\nProduit: ${testData.product || 'Application mobile'}`;
    
    case 'TITLE_GENERATOR':
      return `${basePrompt}\n\nSujet: ${testData.topic || 'Marketing digital'}\nTon: ${testData.tone || 'Professionnel'}\nAudience: ${testData.audience || 'Entrepreneurs'}`;
    
    case 'OFFER_CREATOR':
      return `${basePrompt}\n\nProduit: ${testData.product || 'Formation en ligne'}\nPrix: ${testData.price || '297€'}\nAudience: ${testData.audience || 'Débutants'}`;
    
    case 'EMAIL_GENERATOR':
      return `${basePrompt}\n\nObjet: ${testData.subject || 'Nouvelle offre'}\nTon: ${testData.tone || 'Amical'}\nObjectif: ${testData.goal || 'Conversion'}`;
    
    case 'CONTENT_SYSTEM':
      return `${basePrompt}\n\nThème: ${testData.theme || 'Productivité'}\nFormat: ${testData.format || 'Article de blog'}\nLongueur: ${testData.length || '500 mots'}`;
    
    default:
      return `${basePrompt}\n\nDonnées de test: ${JSON.stringify(testData)}`;
  }
}

// Fonction pour simuler l'appel à l'IA (à remplacer par l'implémentation réelle)
async function simulateAICall(params: any, provider: string) {
  // Simuler un délai de réponse
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
  
  // Simuler une réponse selon le provider
  const responses = {
    'OpenAI': {
      content: 'Réponse générée par GPT-4 pour le test de l\'outil.',
      tokensUsed: Math.floor(Math.random() * 500) + 100,
      cost: 0.002
    },
    'DeepSeek': {
      content: 'Réponse générée par DeepSeek pour le test de l\'outil.',
      tokensUsed: Math.floor(Math.random() * 600) + 120,
      cost: 0.0014
    },
    'Anthropic': {
      content: 'Réponse générée par Claude pour le test de l\'outil.',
      tokensUsed: Math.floor(Math.random() * 450) + 90,
      cost: 0.015
    }
  };
  
  return responses[provider as keyof typeof responses] || responses['OpenAI'];
}

// Fonction pour obtenir des données de test par défaut
function getDefaultTestInput(toolType: string) {
  const defaultInputs = {
    'ICP_MAKER': {
      company: 'TechStart',
      sector: 'Technologie',
      product: 'Application mobile de productivité',
      targetMarket: 'Entrepreneurs'
    },
    'TITLE_GENERATOR': {
      topic: 'Marketing digital',
      tone: 'Professionnel',
      audience: 'Entrepreneurs',
      keywords: ['marketing', 'digital', 'stratégie']
    },
    'OFFER_CREATOR': {
      product: 'Formation en ligne',
      price: '297€',
      audience: 'Débutants en marketing',
      benefits: ['Augmenter ses ventes', 'Maîtriser les réseaux sociaux']
    },
    'EMAIL_GENERATOR': {
      subject: 'Nouvelle offre exclusive',
      tone: 'Amical',
      goal: 'Conversion',
      audience: 'Clients existants'
    },
    'CONTENT_SYSTEM': {
      theme: 'Productivité',
      format: 'Article de blog',
      length: '500 mots',
      keywords: ['productivité', 'efficacité', 'organisation']
    }
  };
  
  return defaultInputs[toolType as keyof typeof defaultInputs] || {
    input: 'Données de test par défaut',
    context: 'Test automatique'
  };
}

// Fonction pour enregistrer le résultat du test
async function logTestResult({
  toolId,
  userId,
  testResult,
  testInput
}: {
  toolId: string;
  userId: string;
  testResult: TestResult;
  testInput: any;
}) {
  try {
    await supabaseAdmin
      .from('ai_tool_tests')
      .insert({
        tool_id: toolId,
        user_id: userId,
        test_input: testInput,
        success: testResult.success,
        response_time: testResult.responseTime,
        tokens_used: testResult.tokensUsed,
        cost: testResult.cost,
        output: testResult.output,
        error_message: testResult.error,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Erreur enregistrement test:', error);
    // Ne pas faire échouer le test si l'enregistrement échoue
  }
}