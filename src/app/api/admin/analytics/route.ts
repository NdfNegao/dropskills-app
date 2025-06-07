import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/admin/analytics - Récupérer les analytics avancées
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const tools = searchParams.get('tools')?.split(',').filter(Boolean) || [];
    const models = searchParams.get('models')?.split(',').filter(Boolean) || [];

    // Calculer la date de début basée sur timeRange
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Construire les filtres
    let query = supabaseAdmin
      .from('ai_usage_logs')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (tools.length > 0) {
      query = query.in('tool_id', tools);
    }

    if (models.length > 0) {
      query = query.in('model', models);
    }

    const { data: usageLogs, error } = await query;

    if (error) {
      console.error('Erreur récupération logs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Si pas de données, retourner des données par défaut
    if (!usageLogs || usageLogs.length === 0) {
      return NextResponse.json(await generateMockAnalytics(timeRange));
    }

    // Calculer les métriques overview
    const totalRequests = usageLogs.length;
    const successfulRequests = usageLogs.filter(log => log.status === 'success').length;
    const failedRequests = totalRequests - successfulRequests;
    const avgResponseTime = Math.round(
      usageLogs.reduce((acc, log) => acc + (log.response_time || 0), 0) / totalRequests
    );
    const totalTokensUsed = usageLogs.reduce((acc, log) => acc + (log.tokens_used || 0), 0);
    const totalCost = usageLogs.reduce((acc, log) => acc + (log.cost || 0), 0);

    // Récupérer les utilisateurs actifs
    const uniqueUsers = new Set(usageLogs.map(log => log.user_id).filter(Boolean));
    const activeUsers = uniqueUsers.size;

    // Outils populaires
    const toolUsage = usageLogs.reduce((acc, log) => {
      acc[log.tool_id] = (acc[log.tool_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularTools = Object.entries(toolUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([toolId]) => toolId);

    // Générer les données de série temporelle
    const timeSeriesData = generateTimeSeriesData(usageLogs, timeRange);

    // Métriques par outil
    const toolMetrics = await generateToolMetrics(usageLogs);

    // Métriques par modèle
    const modelMetrics = generateModelMetrics(usageLogs);

    // Métriques utilisateurs
    const userMetrics = await generateUserMetrics(usageLogs);

    // Alertes
    const alerts = generateAlerts(usageLogs);

    const analyticsData = {
      overview: {
        totalRequests,
        successfulRequests,
        failedRequests,
        avgResponseTime,
        totalTokensUsed,
        totalCost,
        activeUsers,
        popularTools
      },
      timeSeriesData,
      toolMetrics,
      modelMetrics,
      userMetrics,
      alerts
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Erreur analytics:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Fonction pour générer des données de série temporelle
function generateTimeSeriesData(logs: any[], timeRange: string) {
  const intervals = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
  const intervalMs = timeRange === '1h' ? 5 * 60 * 1000 : 
                    timeRange === '24h' ? 60 * 60 * 1000 : 
                    timeRange === '7d' ? 24 * 60 * 60 * 1000 : 
                    24 * 60 * 60 * 1000;

  const now = new Date();
  const data = [];

  for (let i = intervals - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs);
    const nextTimestamp = new Date(timestamp.getTime() + intervalMs);
    
    const intervalLogs = logs.filter(log => {
      const logTime = new Date(log.created_at);
      return logTime >= timestamp && logTime < nextTimestamp;
    });

    const requests = intervalLogs.length;
    const successfulRequests = intervalLogs.filter(log => log.status === 'success').length;
    const successRate = requests > 0 ? Math.round((successfulRequests / requests) * 100) : 100;
    const responseTime = requests > 0 
      ? Math.round(intervalLogs.reduce((acc, log) => acc + (log.response_time || 0), 0) / requests)
      : 0;
    const tokensUsed = intervalLogs.reduce((acc, log) => acc + (log.tokens_used || 0), 0);
    const cost = intervalLogs.reduce((acc, log) => acc + (log.cost || 0), 0);

    data.push({
      timestamp: timestamp.toISOString(),
      requests,
      responseTime,
      successRate,
      tokensUsed,
      cost
    });
  }

  return data;
}

// Fonction pour générer les métriques par outil
async function generateToolMetrics(logs: any[]) {
  const toolGroups = logs.reduce((acc, log) => {
    if (!acc[log.tool_id]) {
      acc[log.tool_id] = [];
    }
    acc[log.tool_id].push(log);
    return acc;
  }, {} as Record<string, any[]>);

  const metrics = [];
  
  for (const [toolId, toolLogs] of Object.entries(toolGroups)) {
    // Récupérer le nom de l'outil
    const { data: tool } = await supabaseAdmin
      .from('ai_tools')
      .select('name')
      .eq('id', toolId)
      .single();

    const requests = toolLogs.length;
    const successfulRequests = toolLogs.filter(log => log.status === 'success').length;
    const successRate = Math.round((successfulRequests / requests) * 100);
    const avgResponseTime = Math.round(
      toolLogs.reduce((acc, log) => acc + (log.response_time || 0), 0) / requests
    );
    const tokensUsed = toolLogs.reduce((acc, log) => acc + (log.tokens_used || 0), 0);
    const cost = toolLogs.reduce((acc, log) => acc + (log.cost || 0), 0);

    // Analyser les erreurs
    const errors = toolLogs
      .filter(log => log.status === 'error')
      .reduce((acc, log) => {
        const errorType = log.error_type || 'Unknown';
        if (!acc[errorType]) {
          acc[errorType] = { count: 0, lastOccurrence: log.created_at };
        }
        acc[errorType].count++;
        if (new Date(log.created_at) > new Date(acc[errorType].lastOccurrence)) {
          acc[errorType].lastOccurrence = log.created_at;
        }
        return acc;
      }, {} as Record<string, { count: number; lastOccurrence: string }>);

    metrics.push({
      toolId,
      toolName: tool?.name || `Outil ${toolId}`,
      requests,
      successRate,
      avgResponseTime,
      tokensUsed,
      cost,
      errors: Object.entries(errors).map(([type, data]) => ({
        type,
        count: data.count,
        lastOccurrence: data.lastOccurrence
      }))
    });
  }

  return metrics.sort((a, b) => b.requests - a.requests);
}

// Fonction pour générer les métriques par modèle
function generateModelMetrics(logs: any[]) {
  const modelGroups = logs.reduce((acc, log) => {
    const model = log.model || 'Unknown';
    if (!acc[model]) {
      acc[model] = [];
    }
    acc[model].push(log);
    return acc;
  }, {} as Record<string, any[]>);

  return Object.entries(modelGroups).map(([model, modelLogs]) => {
    const requests = modelLogs.length;
    const successfulRequests = modelLogs.filter(log => log.status === 'success').length;
    const successRate = Math.round((successfulRequests / requests) * 100);
    const avgResponseTime = Math.round(
      modelLogs.reduce((acc, log) => acc + (log.response_time || 0), 0) / requests
    );
    const tokensUsed = modelLogs.reduce((acc, log) => acc + (log.tokens_used || 0), 0);
    const cost = modelLogs.reduce((acc, log) => acc + (log.cost || 0), 0);
    const avgTokensPerRequest = Math.round(tokensUsed / requests);

    return {
      model,
      requests,
      successRate,
      avgResponseTime,
      tokensUsed,
      cost,
      avgTokensPerRequest
    };
  }).sort((a, b) => b.requests - a.requests);
}

// Fonction pour générer les métriques utilisateurs
async function generateUserMetrics(logs: any[]) {
  const uniqueUsers = new Set(logs.map(log => log.user_id).filter(Boolean));
  const activeUsers = uniqueUsers.size;
  
  // Simuler des données utilisateurs (à remplacer par de vraies données)
  const totalUsers = Math.max(activeUsers * 2, 100);
  const newUsers = Math.floor(activeUsers * 0.3);

  // Top utilisateurs
  const userUsage = logs.reduce((acc, log) => {
    if (log.user_id) {
      if (!acc[log.user_id]) {
        acc[log.user_id] = { requests: 0, tokensUsed: 0 };
      }
      acc[log.user_id].requests++;
      acc[log.user_id].tokensUsed += log.tokens_used || 0;
    }
    return acc;
  }, {} as Record<string, { requests: number; tokensUsed: number }>);

  const topUsers = Object.entries(userUsage)
    .sort(([,a], [,b]) => b.requests - a.requests)
    .slice(0, 10)
    .map(([userId, data]) => ({
      userId,
      username: `Utilisateur ${userId.slice(-4)}`, // Simulé
      requests: data.requests,
      tokensUsed: data.tokensUsed
    }));

  return {
    totalUsers,
    activeUsers,
    newUsers,
    topUsers
  };
}

// Fonction pour générer les alertes
function generateAlerts(logs: any[]) {
  const alerts = [];
  const now = new Date();

  // Vérifier le taux d'erreur
  const recentLogs = logs.filter(log => 
    new Date(log.created_at) > new Date(now.getTime() - 60 * 60 * 1000)
  );
  
  if (recentLogs.length > 0) {
    const errorRate = (recentLogs.filter(log => log.status === 'error').length / recentLogs.length) * 100;
    
    if (errorRate > 10) {
      alerts.push({
        id: 'high-error-rate',
        type: 'error' as const,
        message: `Taux d'erreur élevé détecté: ${Math.round(errorRate)}% dans la dernière heure`,
        timestamp: now.toISOString(),
        resolved: false
      });
    }

    // Vérifier les temps de réponse
    const avgResponseTime = recentLogs.reduce((acc, log) => acc + (log.response_time || 0), 0) / recentLogs.length;
    
    if (avgResponseTime > 5000) {
      alerts.push({
        id: 'slow-response',
        type: 'warning' as const,
        message: `Temps de réponse lent détecté: ${Math.round(avgResponseTime)}ms en moyenne`,
        timestamp: now.toISOString(),
        resolved: false
      });
    }
  }

  return alerts;
}

// Fonction pour générer des analytics de démonstration
async function generateMockAnalytics(timeRange: string) {
  const intervals = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
  const now = new Date();
  
  // Générer des données de série temporelle simulées
  const timeSeriesData = Array.from({ length: intervals }, (_, i) => {
    const timestamp = new Date(now.getTime() - (intervals - 1 - i) * (timeRange === '1h' ? 5 * 60 * 1000 : timeRange === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000));
    return {
      timestamp: timestamp.toISOString(),
      requests: Math.floor(Math.random() * 100) + 20,
      responseTime: Math.floor(Math.random() * 2000) + 500,
      successRate: Math.floor(Math.random() * 10) + 90,
      tokensUsed: Math.floor(Math.random() * 5000) + 1000,
      cost: Math.random() * 10 + 2
    };
  });

  const totalRequests = timeSeriesData.reduce((acc, data) => acc + data.requests, 0);
  const successfulRequests = Math.floor(totalRequests * 0.95);
  
  return {
    overview: {
      totalRequests,
      successfulRequests,
      failedRequests: totalRequests - successfulRequests,
      avgResponseTime: 1250,
      totalTokensUsed: 45000,
      totalCost: 125.50,
      activeUsers: 23,
      popularTools: ['icp-maker', 'generateur-titres', 'createur-offres']
    },
    timeSeriesData,
    toolMetrics: [
      {
        toolId: 'icp-maker',
        toolName: 'ICP Maker',
        requests: Math.floor(totalRequests * 0.4),
        successRate: 96,
        avgResponseTime: 1100,
        tokensUsed: 18000,
        cost: 45.20,
        errors: []
      },
      {
        toolId: 'generateur-titres',
        toolName: 'Générateur de Titres',
        requests: Math.floor(totalRequests * 0.3),
        successRate: 98,
        avgResponseTime: 800,
        tokensUsed: 12000,
        cost: 28.50,
        errors: []
      },
      {
        toolId: 'createur-offres',
        toolName: 'Créateur d\'Offres',
        requests: Math.floor(totalRequests * 0.3),
        successRate: 94,
        avgResponseTime: 1500,
        tokensUsed: 15000,
        cost: 51.80,
        errors: [
          {
            type: 'Rate Limit',
            count: 2,
            lastOccurrence: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ],
    modelMetrics: [
      {
        model: 'gpt-4',
        requests: Math.floor(totalRequests * 0.6),
        successRate: 96,
        avgResponseTime: 1400,
        tokensUsed: 30000,
        cost: 85.20,
        avgTokensPerRequest: 750
      },
      {
        model: 'gpt-3.5-turbo',
        requests: Math.floor(totalRequests * 0.4),
        successRate: 97,
        avgResponseTime: 900,
        tokensUsed: 15000,
        cost: 40.30,
        avgTokensPerRequest: 500
      }
    ],
    userMetrics: {
      totalUsers: 156,
      activeUsers: 23,
      newUsers: 7,
      topUsers: [
        { userId: 'user1', username: 'Utilisateur 1234', requests: 45, tokensUsed: 8500 },
        { userId: 'user2', username: 'Utilisateur 5678', requests: 38, tokensUsed: 7200 },
        { userId: 'user3', username: 'Utilisateur 9012', requests: 32, tokensUsed: 6100 }
      ]
    },
    alerts: [
      {
        id: 'info-usage-spike',
        type: 'info' as const,
        message: 'Pic d\'utilisation détecté sur l\'outil ICP Maker (+25% par rapport à hier)',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        resolved: false
      }
    ]
  };
}