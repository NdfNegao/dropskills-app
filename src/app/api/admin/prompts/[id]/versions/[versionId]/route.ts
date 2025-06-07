import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/admin/prompts/[id]/versions/[versionId] - Récupérer une version spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { data: version, error } = await supabaseAdmin
      .from('ai_prompt_versions')
      .select(`
        *,
        ai_prompts(
          id,
          name,
          description
        ),
        ai_prompt_tests(
          id,
          success,
          response_time,
          tokens_used,
          cost,
          output,
          error_message,
          test_data,
          created_at
        )
      `)
      .eq('id', params.versionId)
      .eq('prompt_id', params.id)
      .single();

    if (error || !version) {
      return NextResponse.json(
        { error: 'Version non trouvée' },
        { status: 404 }
      );
    }

    // Calculer les statistiques de cette version
    const tests = version.ai_prompt_tests || [];
    const recentTests = tests.filter(test => 
      new Date(test.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const stats = {
      totalTests: tests.length,
      recentTests: recentTests.length,
      successRate: tests.length > 0 ? 
        (tests.filter(test => test.success).length / tests.length) * 100 : 0,
      avgResponseTime: tests.length > 0 ?
        tests.reduce((sum, test) => sum + (test.response_time || 0), 0) / tests.length : 0,
      totalTokens: tests.reduce((sum, test) => sum + (test.tokens_used || 0), 0),
      totalCost: tests.reduce((sum, test) => sum + (test.cost || 0), 0),
      lastTested: tests.length > 0 ? 
        Math.max(...tests.map(test => new Date(test.created_at).getTime())) : null
    };

    return NextResponse.json({
      ...version,
      stats
    });
  } catch (error) {
    console.error('Erreur récupération version:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/prompts/[id]/versions/[versionId] - Mettre à jour une version
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const {
      content,
      system_prompt,
      parameters,
      changelog,
      is_active
    } = body;

    // Vérifier que la version existe
    const { data: existingVersion, error: fetchError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .select('*')
      .eq('id', params.versionId)
      .eq('prompt_id', params.id)
      .single();

    if (fetchError || !existingVersion) {
      return NextResponse.json(
        { error: 'Version non trouvée' },
        { status: 404 }
      );
    }

    // Si cette version doit devenir active, désactiver les autres
    if (is_active && !existingVersion.is_active) {
      await supabaseAdmin
        .from('ai_prompt_versions')
        .update({ is_active: false })
        .eq('prompt_id', params.id)
        .neq('id', params.versionId);
    }

    // Mettre à jour la version
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (content !== undefined) updateData.content = content;
    if (system_prompt !== undefined) updateData.system_prompt = system_prompt;
    if (parameters !== undefined) updateData.parameters = parameters;
    if (changelog !== undefined) updateData.changelog = changelog;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: updatedVersion, error: updateError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .update(updateData)
      .eq('id', params.versionId)
      .eq('prompt_id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur mise à jour version:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      version: updatedVersion
    });
  } catch (error) {
    console.error('Erreur mise à jour version:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/prompts/[id]/versions/[versionId] - Supprimer une version
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Vérifier que la version existe
    const { data: version, error: fetchError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .select('is_active')
      .eq('id', params.versionId)
      .eq('prompt_id', params.id)
      .single();

    if (fetchError || !version) {
      return NextResponse.json(
        { error: 'Version non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier qu'il reste au moins une autre version
    const { data: otherVersions } = await supabaseAdmin
      .from('ai_prompt_versions')
      .select('id')
      .eq('prompt_id', params.id)
      .neq('id', params.versionId);

    if (!otherVersions || otherVersions.length === 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer la dernière version d\'un prompt' },
        { status: 400 }
      );
    }

    // Vérifier si la version est utilisée récemment
    const { data: recentTests } = await supabaseAdmin
      .from('ai_prompt_tests')
      .select('id')
      .eq('version_id', params.versionId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (recentTests && recentTests.length > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer une version testée récemment' 
        },
        { status: 400 }
      );
    }

    // Si c'est la version active, activer une autre version
    if (version.is_active && otherVersions.length > 0) {
      await supabaseAdmin
        .from('ai_prompt_versions')
        .update({ is_active: true })
        .eq('id', otherVersions[0].id);
    }

    // Supprimer les tests associés
    await supabaseAdmin
      .from('ai_prompt_tests')
      .delete()
      .eq('version_id', params.versionId);

    // Supprimer la version
    const { error: deleteError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .delete()
      .eq('id', params.versionId)
      .eq('prompt_id', params.id);

    if (deleteError) {
      console.error('Erreur suppression version:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Version supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression version:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}