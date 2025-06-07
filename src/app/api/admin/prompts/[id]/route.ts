import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/admin/prompts/[id] - Récupérer un prompt spécifique
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id } = params;

    // Récupérer le prompt avec ses versions
    const { data: prompt, error } = await supabaseAdmin
      .from('ai_prompts')
      .select(`
        *,
        ai_prompt_versions(
          id,
          version,
          content,
          system_prompt,
          parameters,
          is_active,
          created_at,
          created_by
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur récupération prompt:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt non trouvé' }, { status: 404 });
    }

    // Récupérer les statistiques d'utilisation
    const { data: usageStats } = await supabaseAdmin
      .from('ai_usage_logs')
      .select('id, status, created_at')
      .eq('prompt_id', id)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const stats = {
      totalUsage: usageStats?.length || 0,
      successRate: usageStats?.length 
        ? Math.round((usageStats.filter(log => log.status === 'success').length / usageStats.length) * 100)
        : 0,
      last30Days: usageStats?.length || 0
    };

    return NextResponse.json({
      ...prompt,
      stats
    });
  } catch (error) {
    console.error('Erreur récupération prompt:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/prompts/[id] - Mettre à jour un prompt
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const {
      name,
      description,
      category,
      tags,
      content,
      systemPrompt,
      parameters,
      isActive,
      createNewVersion
    } = body;

    // Vérifier que le prompt existe
    const { data: existingPrompt, error: fetchError } = await supabaseAdmin
      .from('ai_prompts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingPrompt) {
      return NextResponse.json({ error: 'Prompt non trouvé' }, { status: 404 });
    }

    // Mettre à jour les informations du prompt
    const { data: updatedPrompt, error: updateError } = await supabaseAdmin
      .from('ai_prompts')
      .update({
        name: name || existingPrompt.name,
        description: description || existingPrompt.description,
        category: category || existingPrompt.category,
        tags: tags || existingPrompt.tags,
        is_active: isActive !== undefined ? isActive : existingPrompt.is_active,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur mise à jour prompt:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Si on doit créer une nouvelle version ou si le contenu a changé
    if (createNewVersion || content || systemPrompt || parameters) {
      // Désactiver l'ancienne version active
      await supabaseAdmin
        .from('ai_prompt_versions')
        .update({ is_active: false })
        .eq('prompt_id', id)
        .eq('is_active', true);

      // Récupérer le numéro de version suivant
      const { data: versions } = await supabaseAdmin
        .from('ai_prompt_versions')
        .select('version')
        .eq('prompt_id', id)
        .order('version', { ascending: false })
        .limit(1);

      const nextVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1;

      // Créer la nouvelle version
      const { data: newVersion, error: versionError } = await supabaseAdmin
        .from('ai_prompt_versions')
        .insert({
          prompt_id: id,
          version: nextVersion,
          content: content || existingPrompt.content,
          system_prompt: systemPrompt || existingPrompt.system_prompt,
          parameters: parameters || existingPrompt.parameters || {},
          is_active: true,
          created_at: new Date().toISOString(),
          created_by: session.user.id
        })
        .select()
        .single();

      if (versionError) {
        console.error('Erreur création version:', versionError);
        return NextResponse.json({ error: versionError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        prompt: updatedPrompt,
        newVersion
      });
    }

    return NextResponse.json({
      success: true,
      prompt: updatedPrompt
    });
  } catch (error) {
    console.error('Erreur mise à jour prompt:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/prompts/[id] - Supprimer un prompt
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id } = params;

    // Vérifier que le prompt n'est pas utilisé par des outils actifs
    const { data: activeTools } = await supabaseAdmin
      .from('ai_tools')
      .select('id, name')
      .eq('prompt_id', id)
      .eq('is_active', true);

    if (activeTools && activeTools.length > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer ce prompt car il est utilisé par des outils actifs',
          activeTools: activeTools.map(tool => tool.name)
        },
        { status: 400 }
      );
    }

    // Supprimer d'abord les versions du prompt
    const { error: versionsError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .delete()
      .eq('prompt_id', id);

    if (versionsError) {
      console.error('Erreur suppression versions:', versionsError);
      return NextResponse.json({ error: versionsError.message }, { status: 500 });
    }

    // Supprimer le prompt
    const { error: promptError } = await supabaseAdmin
      .from('ai_prompts')
      .delete()
      .eq('id', id);

    if (promptError) {
      console.error('Erreur suppression prompt:', promptError);
      return NextResponse.json({ error: promptError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression prompt:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}