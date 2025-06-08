import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, all
    
    // Calculer la date de début selon la période
    let startDate = new Date();
    if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate = new Date('2020-01-01'); // Toutes les données
    }

    // 1. Statistiques globales
    const { data: globalStats } = await supabaseAdmin
      .from('ai_tool_logs')
      .select('id, tokens_used, cost_estimate, status')
      .gte('created_at', startDate.toISOString());

    const totalRequests = globalStats?.length || 0;
    const totalTokens = globalStats?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0;
    const totalCost = globalStats?.reduce((sum, log) => sum + (log.cost_estimate || 0), 0) || 0;
    const successRate = globalStats ? 
      (globalStats.filter(log => log.status === 'success').length / totalRequests * 100) : 0;

    // 2. Statistiques par outil
    const { data: toolsData } = await supabaseAdmin
      .from('ai_tools')
      .select('*');

    const toolStats = await Promise.all(
      (toolsData || []).map(async (tool) => {
        const { data: logs } = await supabaseAdmin
          .from('ai_tool_logs')
          .select('*')
          .eq('tool_id', tool.id)
          .gte('created_at', startDate.toISOString());

        const usage = logs?.length || 0;
        const tokens = logs?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0;
        const cost = logs?.reduce((sum, log) => sum + (log.cost_estimate || 0), 0) || 0;
        const errors = logs?.filter(log => log.status === 'error').length || 0;

        return {
          id: tool.id,
          name: tool.name,
          category: tool.category,
          usage,
          tokens,
          cost,
          errors,
          successRate: usage > 0 ? ((usage - errors) / usage * 100) : 0
        };
      })
    );

    // 3. Top utilisateurs
    const { data: userLogs } = await supabaseAdmin
      .from('ai_tool_logs')
      .select('user_email, tokens_used, cost_estimate')
      .gte('created_at', startDate.toISOString());

    type UserStat = { usage: number; tokens: number; cost: number };
    const userStats = userLogs?.reduce((acc: Record<string, UserStat>, log) => {
      if (!log.user_email) return acc;
      
      if (!acc[log.user_email]) {
        acc[log.user_email] = { usage: 0, tokens: 0, cost: 0 };
      }
      
      acc[log.user_email].usage += 1;
      acc[log.user_email].tokens += log.tokens_used || 0;
      acc[log.user_email].cost += log.cost_estimate || 0;
      
      return acc;
    }, {});

    const topUsers = Object.entries(userStats || {})
      .map(([email, stats]: [string, UserStat]) => ({
        email,
        usage: stats.usage,
        tokens: stats.tokens,
        cost: stats.cost
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);

    // 4. Évolution par jour
    const { data: dailyLogs } = await supabaseAdmin
      .from('ai_tool_logs')
      .select('created_at, tokens_used, cost_estimate')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    type DailyStat = { usage: number; tokens: number; cost: number };
    const dailyStats = dailyLogs?.reduce((acc: Record<string, DailyStat>, log) => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = { usage: 0, tokens: 0, cost: 0 };
      }
      
      acc[date].usage += 1;
      acc[date].tokens += log.tokens_used || 0;
      acc[date].cost += log.cost_estimate || 0;
      
      return acc;
    }, {});

    const evolution = Object.entries(dailyStats || {})
      .map(([date, stats]: [string, DailyStat]) => ({
        date,
        usage: stats.usage,
        tokens: stats.tokens,
        cost: stats.cost
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      global: {
        totalRequests,
        totalTokens,
        totalCost,
        successRate
      },
      tools: toolStats.sort((a, b) => b.usage - a.usage),
      topUsers,
      evolution,
      period
    });
  } catch (error) {
    console.error('Erreur analytics:', error);
    
    // Retourner des données par défaut en cas d'erreur
    return NextResponse.json({
      global: {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        successRate: 0
      },
      tools: [],
      topUsers: [],
      evolution: [],
      period
    });
  }
}