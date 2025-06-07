import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/admin/prompts/[id]/versions - Récupérer toutes les versions d'un prompt
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Vérifier que le prompt existe
    const { data: prompt, error: promptError } = await supabaseAdmin
      .from('ai_prompts')
      .select('id, name')
      .eq('id', params.id)
      .single();

    if (promptError || !prompt) {
      return NextResponse.json(
        { error: 'Prompt non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer toutes les versions avec statistiques d'usage
    const { data: versions, error: versionsError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .select(`
        *,
        ai_prompt_tests(
          id,
          success,
          response_time,
          tokens_used,
          cost,
          created_at
        )
      `)
      .eq('prompt_id', params.id)
      .order('version', { ascending: false });

    if (versionsError) {
      console.error('Erreur récupération versions:', versionsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des versions' },
        { status: 500 }
      );
    }

    // Enrichir chaque version avec des statistiques
    const enrichedVersions = versions?.map(version => {
      const tests = version.ai_prompt_tests || [];
      const recentTests = tests.filter(test => 
        new Date(test.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      return {
        ...version,
        stats: {
          totalTests: tests.length,
          recentTests: recentTests.length,
          successRate: tests.length > 0 ? 
            (tests.filter(test => test.success).length / tests.length) * 100 : 0,
          avgResponseTime: tests.length > 0 ?
            tests.reduce((sum, test) => sum + (test.response_time || 0), 0) / tests.length : 0,
          totalTokens: tests.reduce((sum, test) => sum + (test.tokens_used || 0), 0),
          totalCost: tests.reduce((sum, test) => sum + (test.cost || 0), 0)
        },
        ai_prompt_tests: undefined // Supprimer les données brutes pour alléger la réponse
      };
    }) || [];

    return NextResponse.json({
      prompt,
      versions: enrichedVersions
    });
  } catch (error) {
    console.error('Erreur récupération versions prompt:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/admin/prompts/[id]/versions - Créer une nouvelle version
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
      is_active = false
    } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Le contenu du prompt est requis' },
        { status: 400 }
      );
    }

    // Vérifier que le prompt existe
    const { data: prompt, error: promptError } = await supabaseAdmin
      .from('ai_prompts')
      .select('id, name')
      .eq('id', params.id)
      .single();

    if (promptError || !prompt) {
      return NextResponse.json(
        { error: 'Prompt non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer la dernière version pour déterminer le numéro de version
    const { data: lastVersion } = await supabaseAdmin
      .from('ai_prompt_versions')
      .select('version')
      .eq('prompt_id', params.id)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    const nextVersion = (lastVersion?.version || 0) + 1;

    // Si cette version doit être active, désactiver les autres
    if (is_active) {
      await supabaseAdmin
        .from('ai_prompt_versions')
        .update({ is_active: false })
        .eq('prompt_id', params.id);
    }

    // Créer la nouvelle version
    const { data: newVersion, error: createError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .insert({
        prompt_id: params.id,
        version: nextVersion,
        content,
        system_prompt,
        parameters: parameters || {},
        changelog: changelog || `Version ${nextVersion}`,
        is_active,
        created_by: session.user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Erreur création version:', createError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la version' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      version: newVersion,
      message: `Version ${nextVersion} créée avec succès`
    });
  } catch (error) {
    console.error('Erreur création version prompt:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}