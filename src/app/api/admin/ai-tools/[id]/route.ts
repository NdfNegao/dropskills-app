import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/admin/ai-tools/[id] - Récupérer un outil spécifique


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { data: tool, error } = await supabaseAdmin
      .from('ai_tools')
      .select(`
        *,
        ai_tool_configs(
          id,
          provider,
          model,
          parameters,
          is_active,
          created_at
        ),
        ai_prompts(
          id,
          name,
          description,
          ai_prompt_versions(
            id,
            version,
            content,
            system_prompt,
            is_active
          )
        )
      `)
      .eq('id', params.id)
      .single();

    if (error || !tool) {
      return NextResponse.json(
        { error: 'Outil non trouvé' },
        { status: 404 }
      );
    }

    // Enrichir avec les statistiques d'usage
    const { data: usageStats } = await supabaseAdmin
      .from('ai_usage_logs')
      .select('success, response_time, tokens_used, cost')
      .eq('tool_id', params.id)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const stats = {
      totalCalls: usageStats?.length || 0,
      successRate: usageStats?.length ? 
        (usageStats.filter(log => log.success).length / usageStats.length) * 100 : 0,
      avgResponseTime: usageStats?.length ?
        usageStats.reduce((sum, log) => sum + (log.response_time || 0), 0) / usageStats.length : 0,
      totalTokens: usageStats?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0,
      totalCost: usageStats?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0
    };

    return NextResponse.json({
      ...tool,
      stats
    });
  } catch (error) {
    console.error('Erreur récupération outil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT : Met à jour un outil IA
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      is_active,
      config,
      prompt_id,
      input_schema,
      output_schema,
      tags
    } = body;

    // Vérifier que l'outil existe
    const { data: existingTool, error: fetchError } = await supabaseAdmin
      .from('ai_tools')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingTool) {
      return NextResponse.json(
        { error: 'Outil non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour l'outil
    const { data: updatedTool, error: updateError } = await supabaseAdmin
      .from('ai_tools')
      .update({
        name,
        description,
        category,
        is_active,
        prompt_id,
        input_schema,
        output_schema,
        tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur mise à jour outil:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    // Mettre à jour la configuration si fournie
    if (config) {
      // Désactiver les anciennes configurations
      await supabaseAdmin
        .from('ai_tool_configs')
        .update({ is_active: false })
        .eq('tool_id', params.id);

      // Créer la nouvelle configuration
      await supabaseAdmin
        .from('ai_tool_configs')
        .insert({
          tool_id: params.id,
          provider: config.provider,
          model: config.model,
          parameters: config.parameters,
          is_active: true,
          created_at: new Date().toISOString()
        });
    }

    return NextResponse.json({
      success: true,
      tool: updatedTool
    });
  } catch (error) {
    console.error('Erreur mise à jour outil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE : Supprime un outil IA
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Vérifier si l'outil est utilisé récemment
    const { data: recentUsage } = await supabaseAdmin
      .from('ai_usage_logs')
      .select('id')
      .eq('tool_id', params.id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (recentUsage && recentUsage.length > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer un outil utilisé récemment. Désactivez-le plutôt.' 
        },
        { status: 400 }
      );
    }

    // Supprimer les configurations associées
    await supabaseAdmin
      .from('ai_tool_configs')
      .delete()
      .eq('tool_id', params.id);

    // Supprimer l'outil
    const { error } = await supabaseAdmin
      .from('ai_tools')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erreur suppression outil:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Outil supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression outil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}