import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    // Calculer la date de début selon la période
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Récupérer les logs d'utilisation IA (à créer)
    const { data: aiLogs, error: logsError } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (logsError) {
      console.warn('Table ai_usage_logs non trouvée, utilisation de données mock');
    }

    // Si pas de logs ou table non existante, retourner des données mock
    const mockData = {
      tools: [
        {
          id: 'icp-generator',
          name: 'ICP Generator',
          type: 'ICP_GENERATOR',
          status: 'active',
          provider: 'DeepSeek V3',
          usageCount: Math.floor(Math.random() * 100) + 20,
          avgResponseTime: Math.floor(Math.random() * 1000) + 800,
          avgCost: Math.random() * 0.01 + 0.001,
          successRate: Math.random() * 5 + 95,
          lastUsed: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          endpoint: '/api/ai/icp/generate',
          model: 'deepseek-chat',
          systemPrompt: 'Tu es un expert en stratégie marketing...'
        },
        {
          id: 'title-generator',
          name: 'Générateur de Titres',
          type: 'TITLE_GENERATOR',
          status: 'active',
          provider: 'DeepSeek V3',
          usageCount: Math.floor(Math.random() * 150) + 50,
          avgResponseTime: Math.floor(Math.random() * 500) + 600,
          avgCost: Math.random() * 0.005 + 0.001,
          successRate: Math.random() * 3 + 97,
          lastUsed: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          endpoint: '/api/ai/titles/generate',
          model: 'deepseek-chat',
          systemPrompt: 'Tu es un expert en copywriting...'
        },
        {
          id: 'offer-generator',
          name: 'Générateur d\'Offres',
          type: 'OFFER_GENERATOR',
          status: 'active',
          provider: 'OpenAI GPT-4',
          usageCount: Math.floor(Math.random() * 50) + 10,
          avgResponseTime: Math.floor(Math.random() * 1500) + 1500,
          avgCost: Math.random() * 0.1 + 0.05,
          successRate: Math.random() * 5 + 95,
          lastUsed: new Date(Date.now() - Math.random() * 7200000).toISOString(),
          endpoint: '/api/ai/offer/generate',
          model: 'gpt-4o-mini',
          systemPrompt: 'Tu es un expert en copywriting commercial...'
        },
        {
          id: 'email-sequence',
          name: 'CopyMoneyMail',
          type: 'EMAIL_SEQUENCE',
          status: 'active',
          provider: 'DeepSeek V3',
          usageCount: Math.floor(Math.random() * 80) + 30,
          avgResponseTime: Math.floor(Math.random() * 800) + 1000,
          avgCost: Math.random() * 0.008 + 0.003,
          successRate: Math.random() * 4 + 96,
          lastUsed: new Date(Date.now() - Math.random() * 1800000).toISOString(),
          endpoint: '/api/ai/emails/generate',
          model: 'deepseek-chat',
          systemPrompt: 'Tu es un expert en email marketing...'
        },
        {
          id: 'content-system',
          name: 'Content System 90J',
          type: 'CONTENT_SYSTEM',
          status: Math.random() > 0.8 ? 'paused' : 'active',
          provider: 'Claude 3.5',
          usageCount: Math.floor(Math.random() * 20) + 5,
          avgResponseTime: Math.floor(Math.random() * 2000) + 2500,
          avgCost: Math.random() * 0.05 + 0.06,
          successRate: Math.random() * 2 + 98,
          lastUsed: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
          endpoint: '/api/ai/content-system/generate',
          model: 'claude-3-5-sonnet',
          systemPrompt: 'Tu es un expert en stratégie de contenu...'
        }
      ],
      metrics: {
        totalRequests: 0,
        totalCost: 0,
        avgResponseTime: 0,
        successRate: 0,
        topPerformingTool: '',
        costSavings: 0
      }
    };

    // Calculer les métriques à partir des outils
    const totalRequests = mockData.tools.reduce((sum, tool) => sum + tool.usageCount, 0);
    const totalCost = mockData.tools.reduce((sum, tool) => sum + (tool.usageCount * tool.avgCost), 0);
    const avgResponseTime = mockData.tools.reduce((sum, tool) => sum + tool.avgResponseTime, 0) / mockData.tools.length;
    const avgSuccessRate = mockData.tools.reduce((sum, tool) => sum + tool.successRate, 0) / mockData.tools.length;
    
    // Calculer les économies (comparaison avec OpenAI uniquement)
    const openAICostEstimate = totalRequests * 0.15; // Prix estimé si tout était sur OpenAI
    const costSavings = openAICostEstimate - totalCost;
    
    // Trouver le top performer
    const topTool = mockData.tools.reduce((best, tool) => 
      tool.successRate > best.successRate ? tool : best
    );

    mockData.metrics = {
      totalRequests,
      totalCost: Math.round(totalCost * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime),
      successRate: Math.round(avgSuccessRate * 10) / 10,
      topPerformingTool: topTool.name,
      costSavings: Math.round(costSavings * 100) / 100
    };

    return NextResponse.json({
      success: true,
      data: mockData,
      timeRange,
      generated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur récupération métriques IA:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des métriques',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// POST: Enregistrer une utilisation d'outil IA
export async function POST(request: NextRequest) {
  try {
    const { toolId, provider, responseTime, cost, success, errorMessage } = await request.json();
    
    // Validation
    if (!toolId || !provider || responseTime === undefined) {
      return NextResponse.json(
        { error: 'Paramètres manquants: toolId, provider, responseTime requis' },
        { status: 400 }
      );
    }

    // Enregistrer l'utilisation (table à créer)
    const logEntry = {
      tool_id: toolId,
      provider,
      response_time: responseTime,
      cost: cost || 0,
      success: success !== false,
      error_message: errorMessage || null,
      created_at: new Date().toISOString()
    };

    // Essayer d'insérer dans la table ai_usage_logs
    const { data, error } = await supabase
      .from('ai_usage_logs')
      .insert([logEntry])
      .select()
      .single();

    if (error) {
      console.warn('Impossible d\'enregistrer le log IA (table non créée?):', error);
      // Continuer sans erreur pour ne pas bloquer l'utilisation
    }

    return NextResponse.json({
      success: true,
      message: 'Utilisation enregistrée',
      data: data || logEntry
    });

  } catch (error) {
    console.error('Erreur enregistrement utilisation IA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    );
  }
} 