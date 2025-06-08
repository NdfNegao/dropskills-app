import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { AI_PROVIDERS } from '@/lib/ai-providers';

export const dynamic = 'force-dynamic';

interface PromptTestRequest {
  promptId: string;
  versionId?: string;
  testData: Record<string, any>;
  model?: string;
  provider?: string;
  parameters?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
}

interface PromptTestResult {
  success: boolean;
  output?: string;
  responseTime: number;
  tokensUsed?: number;
  cost?: number;
  error?: string;
  timestamp: string;
  promptUsed: string;
  testData: Record<string, any>;
}

// POST /api/admin/prompts/test - Tester un prompt
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body: PromptTestRequest = await request.json();
    const { promptId, versionId, testData, model, provider, parameters } = body;

    if (!promptId || !testData) {
      return NextResponse.json(
        { error: 'promptId et testData sont requis' },
        { status: 400 }
      );
    }

    // Récupérer le prompt et sa version
    const promptQuery = supabaseAdmin
      .from('ai_prompts')
      .select(`
        *,
        ai_prompt_versions(
          id,
          version,
          content,
          system_prompt,
          parameters,
          is_active
        )
      `)
      .eq('id', promptId);

    const { data: prompt, error: promptError } = await promptQuery.single();

    if (promptError || !prompt) {
      return NextResponse.json(
        { error: 'Prompt non trouvé' },
        { status: 404 }
      );
    }

    // Sélectionner la version à tester
    let selectedVersion;
    if (versionId) {
      selectedVersion = prompt.ai_prompt_versions.find((v: any) => v.id === versionId);
    } else {
      selectedVersion = prompt.ai_prompt_versions.find((v: any) => v.is_active) || prompt.ai_prompt_versions[0];
    }

    if (!selectedVersion) {
      return NextResponse.json(
        { error: 'Version du prompt non trouvée' },
        { status: 404 }
      );
    }

    // Exécuter le test
    const testResult = await executePromptTest({
      prompt,
      version: selectedVersion,
      testData,
      model: model || 'gpt-3.5-turbo',
      provider: provider || 'OpenAI',
      parameters: parameters || selectedVersion.parameters || {}
    });

    // Enregistrer le résultat du test
    await logPromptTestResult({
      promptId,
      versionId: selectedVersion.id,
      userId: session.user.id,
      testResult,
      testData
    });

    return NextResponse.json({
      success: true,
      result: testResult
    });
  } catch (error) {
    console.error('Erreur test prompt:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test du prompt' },
      { status: 500 }
    );
  }
}

// GET /api/admin/prompts/test - Récupérer l'historique des tests


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const promptId = searchParams.get('promptId');
    const versionId = searchParams.get('versionId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabaseAdmin
      .from('ai_prompt_tests')
      .select(`
        *,
        ai_prompts(name),
        ai_prompt_versions(version)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (promptId) {
      query = query.eq('prompt_id', promptId);
    }
    if (versionId) {
      query = query.eq('version_id', versionId);
    }

    const { data: tests, error } = await query;

    if (error) {
      console.error('Erreur récupération tests prompts:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(tests || []);
  } catch (error) {
    console.error('Erreur récupération historique tests prompts:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Fonction pour exécuter le test d'un prompt
async function executePromptTest({
  prompt,
  version,
  testData,
  model,
  provider,
  parameters
}: {
  prompt: any;
  version: any;
  testData: Record<string, any>;
  model: string;
  provider: string;
  parameters: any;
}): Promise<PromptTestResult> {
  const startTime = Date.now();
  
  try {
    // Vérifier que le provider est disponible
    const aiProvider = AI_PROVIDERS[provider];
    if (!aiProvider || !aiProvider.isAvailable()) {
      throw new Error(`Provider ${provider} non disponible`);
    }

    // Construire le prompt final en remplaçant les variables
    const finalPrompt = interpolatePrompt(version.content, testData);
    const systemPrompt = version.system_prompt ? interpolatePrompt(version.system_prompt, testData) : undefined;

    // Préparer les messages
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: finalPrompt });

    // Paramètres de la requête
    const requestParams = {
      model,
      messages,
      max_tokens: parameters.maxTokens || 1000,
      temperature: parameters.temperature || 0.7,
      top_p: parameters.topP || 1,
      frequency_penalty: parameters.frequencyPenalty || 0,
      presence_penalty: parameters.presencePenalty || 0
    };

    // Simuler l'appel à l'API (remplacer par l'appel réel)
    const response = await simulateAICall(requestParams, provider);
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      output: response.content,
      responseTime,
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString(),
      promptUsed: finalPrompt,
      testData
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString(),
      promptUsed: version.content,
      testData
    };
  }
}

// Fonction pour interpoler les variables dans un prompt
function interpolatePrompt(template: string, data: Record<string, any>): string {
  let result = template;
  
  // Remplacer les variables au format {variable}
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  });
  
  // Remplacer les variables au format {{variable}}
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, String(value));
  });
  
  return result;
}

// Fonction pour simuler l'appel à l'IA (à remplacer par l'implémentation réelle)
async function simulateAICall(params: any, provider: string) {
  // Simuler un délai de réponse
  await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
  
  // Simuler une réponse selon le provider et le contenu
  const responses = {
    'OpenAI': {
      content: generateMockResponse(params.messages[params.messages.length - 1].content),
      tokensUsed: Math.floor(Math.random() * 800) + 200,
      cost: 0.002
    },
    'DeepSeek': {
      content: generateMockResponse(params.messages[params.messages.length - 1].content),
      tokensUsed: Math.floor(Math.random() * 900) + 250,
      cost: 0.0014
    },
    'Anthropic': {
      content: generateMockResponse(params.messages[params.messages.length - 1].content),
      tokensUsed: Math.floor(Math.random() * 750) + 180,
      cost: 0.015
    }
  };
  
  return responses[provider as keyof typeof responses] || responses['OpenAI'];
}

// Fonction pour générer une réponse simulée
function generateMockResponse(prompt: string): string {
  if (prompt.toLowerCase().includes('icp') || prompt.toLowerCase().includes('client idéal')) {
    return JSON.stringify({
      profilSociodemographique: {
        age: "25-40 ans",
        sexe: "60% femmes, 40% hommes",
        localisation: "Zones urbaines, France métropolitaine",
        situationPro: "Entrepreneurs, freelances, cadres",
        niveauRevenus: "3000-8000€/mois"
      },
      psychologieMotivations: {
        besoins: ["Gagner du temps", "Augmenter revenus", "Automatiser processus"],
        desirs: ["Liberté financière", "Reconnaissance", "Impact positif"],
        peurs: ["Échec", "Perte de temps", "Investissement non rentable"]
      },
      problemePrincipaux: ["Manque de temps", "Difficultés marketing", "Gestion administrative"]
    }, null, 2);
  }
  
  if (prompt.toLowerCase().includes('titre') || prompt.toLowerCase().includes('accroche')) {
    return JSON.stringify({
      titles: [
        "🚀 Révolutionnez votre business en 30 jours",
        "💡 Le secret des entrepreneurs qui réussissent",
        "⚡ Comment doubler vos revenus cette année",
        "🎯 La méthode qui change tout (résultats garantis)",
        "🔥 Découvrez pourquoi 90% échouent (et comment éviter le piège)"
      ]
    }, null, 2);
  }
  
  return "Réponse générée par l'IA pour le test du prompt. Cette réponse est adaptée au contenu du prompt testé et démontre le bon fonctionnement du système.";
}

// Fonction pour enregistrer le résultat du test
async function logPromptTestResult({
  promptId,
  versionId,
  userId,
  testResult,
  testData
}: {
  promptId: string;
  versionId: string;
  userId: string;
  testResult: PromptTestResult;
  testData: Record<string, any>;
}) {
  try {
    await supabaseAdmin
      .from('ai_prompt_tests')
      .insert({
        prompt_id: promptId,
        version_id: versionId,
        user_id: userId,
        test_data: testData,
        success: testResult.success,
        output: testResult.output,
        response_time: testResult.responseTime,
        tokens_used: testResult.tokensUsed,
        cost: testResult.cost,
        error_message: testResult.error,
        prompt_used: testResult.promptUsed,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Erreur enregistrement test prompt:', error);
    // Ne pas faire échouer le test si l'enregistrement échoue
  }
}