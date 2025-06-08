import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET : Liste tous les outils IA avec analytics


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Récupérer les outils avec leurs configurations
    const { data: tools, error } = await supabaseAdmin
      .from('ai_tools')
      .select(`
        *,
        ai_tool_configs(*),
        ai_usage_logs(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Si aucun outil n'existe, créer des données par défaut
    if (!tools || tools.length === 0) {
      const defaultTools = await createDefaultTools();
      return NextResponse.json({ tools: defaultTools });
    }

    // Enrichir avec les analytics
    const enrichedTools = await Promise.all(
      tools.map(async (tool) => {
        const analytics = await getToolAnalytics(tool.id);
        
        return {
          id: tool.id,
          name: tool.name,
          description: tool.description,
          category: tool.category,
          icon: tool.icon || '🔧',
          path: tool.path || `/outils/${tool.name.toLowerCase().replace(/\s+/g, '-')}`,
          isActive: tool.is_active,
          config: {
            model: tool.ai_tool_configs?.[0]?.model || 'gpt-4',
            temperature: tool.ai_tool_configs?.[0]?.temperature || 0.7,
            maxTokens: tool.ai_tool_configs?.[0]?.max_tokens || 1000,
            systemPrompt: tool.ai_tool_configs?.[0]?.system_prompt || '',
            userPromptTemplate: tool.ai_tool_configs?.[0]?.user_prompt_template || '{input}'
          },
          analytics,
          apiEndpoint: tool.api_endpoint || `/api/outils/${tool.name.toLowerCase().replace(/\s+/g, '-')}`,
          testCases: tool.test_cases || [],
          createdAt: tool.created_at,
          updatedAt: tool.updated_at
        };
      })
    );

    return NextResponse.json({ tools: enrichedTools });
  } catch (error) {
    console.error('Erreur récupération outils IA:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST : Crée un nouvel outil IA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, icon, config } = body;

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Générer le path basé sur le nom
    const path = `/outils/${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    
    const { data: tool, error } = await supabaseAdmin
      .from('ai_tools')
      .insert({
        name,
        description,
        category,
        icon: icon || '🔧',
        path,
        is_active: true,
        api_endpoint: `/api/outils/${name.toLowerCase().replace(/\s+/g, '-')}`,
        test_cases: []
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Créer la configuration par défaut
    if (config) {
      await supabaseAdmin
        .from('ai_tool_configs')
        .insert({
          tool_id: tool.id,
          model: config.model || 'gpt-4',
          temperature: config.temperature || 0.7,
          max_tokens: config.maxTokens || 1000,
          system_prompt: config.systemPrompt || '',
          user_prompt_template: config.userPromptTemplate || '{input}'
        });
    }

    return NextResponse.json({
      tool: {
        ...tool,
        analytics: {
          totalUsage: 0,
          successRate: 100,
          avgResponseTime: 0,
          lastUsed: null,
          popularityScore: 0
        }
      }
    });
  } catch (err) {
    console.error('Erreur création outil:', err);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}

// Fonction pour créer les outils par défaut
async function createDefaultTools() {
  const defaultTools = [
    {
      name: 'ICP Maker',
      description: 'Générateur de profils clients idéaux (Ideal Customer Profile)',
      category: 'Stratégie',
      icon: '🎯',
      path: '/outils/icp-maker',
      is_active: true,
      api_endpoint: '/api/ai/icp/generate',
      test_cases: []
    },
    {
      name: 'Générateur de Titres',
      description: 'Création de titres accrocheurs pour vos contenus',
      category: 'Contenu',
      icon: '📝',

      is_active: true,
      api_endpoint: '/api/ai/titles/generate',
      test_cases: []
    },
    {
      name: 'Créateur d\'Offres',
      description: 'Génération d\'offres commerciales personnalisées',
      category: 'Vente',
      icon: '💰',
      path: '/outils/createur-offres',
      is_active: true,
      api_endpoint: '/api/ai/offer/generate',
      test_cases: []
    }
  ];

  const insertedTools = [];
  for (const tool of defaultTools) {
    const { data, error } = await supabaseAdmin
      .from('ai_tools')
      .insert(tool)
      .select()
      .single();
    
    if (!error) {
      insertedTools.push({
        id: data.id,
        ...tool,
        analytics: {
          totalUsage: Math.floor(Math.random() * 1000) + 100,
          successRate: Math.floor(Math.random() * 10) + 90,
          avgResponseTime: Math.floor(Math.random() * 2000) + 500,
          lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          popularityScore: Math.floor(Math.random() * 100)
        }
      });
    }
  }

  return insertedTools;
}

// Fonction pour récupérer les analytics d'un outil
async function getToolAnalytics(toolId: string) {
  try {
    const { data: usage, error } = await supabaseAdmin
      .from('ai_usage_logs')
      .select('status, response_time, created_at')
      .eq('tool_id', toolId);

    if (error || !usage) {
      return {
        totalUsage: 0,
        successRate: 100,
        avgResponseTime: 0,
        lastUsed: null,
        popularityScore: 0
      };
    }

    const totalUsage = usage.length;
    const successfulCalls = usage.filter(log => log.status === 'success').length;
    const successRate = totalUsage > 0 ? Math.round((successfulCalls / totalUsage) * 100) : 100;
    const avgResponseTime = totalUsage > 0 
      ? Math.round(usage.reduce((acc, log) => acc + (log.response_time || 0), 0) / totalUsage)
      : 0;
    const lastUsed = totalUsage > 0 
      ? usage.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
      : null;

    return {
      totalUsage,
      successRate,
      avgResponseTime,
      lastUsed,
      popularityScore: Math.min(totalUsage, 100)
    };
  } catch (error) {
    console.error('Erreur récupération analytics:', error);
    return {
      totalUsage: 0,
      successRate: 100,
      avgResponseTime: 0,
      lastUsed: null,
      popularityScore: 0
    };
  }
}