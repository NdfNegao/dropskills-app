import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/admin/prompts/[id]/versions/[versionId]/activate - Activer une version spécifique
export async function POST(
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
      .select('id, version, is_active')
      .eq('id', params.versionId)
      .eq('prompt_id', params.id)
      .single();

    if (fetchError || !version) {
      return NextResponse.json(
        { error: 'Version non trouvée' },
        { status: 404 }
      );
    }

    if (version.is_active) {
      return NextResponse.json(
        { error: 'Cette version est déjà active' },
        { status: 400 }
      );
    }

    // Désactiver toutes les autres versions du prompt
    const { error: deactivateError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .update({ is_active: false })
      .eq('prompt_id', params.id);

    if (deactivateError) {
      console.error('Erreur désactivation versions:', deactivateError);
      return NextResponse.json(
        { error: 'Erreur lors de la désactivation des autres versions' },
        { status: 500 }
      );
    }

    // Activer la version demandée
    const { data: activatedVersion, error: activateError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.versionId)
      .eq('prompt_id', params.id)
      .select()
      .single();

    if (activateError) {
      console.error('Erreur activation version:', activateError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'activation' },
        { status: 500 }
      );
    }

    // Mettre à jour le prompt parent pour indiquer qu'il a une version active
    await supabaseAdmin
      .from('ai_prompts')
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    return NextResponse.json({
      success: true,
      version: activatedVersion,
      message: `Version ${version.version} activée avec succès`
    });
  } catch (error) {
    console.error('Erreur activation version:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/prompts/[id]/versions/[versionId]/activate - Désactiver une version
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Vérifier que la version existe et est active
    const { data: version, error: fetchError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .select('id, version, is_active')
      .eq('id', params.versionId)
      .eq('prompt_id', params.id)
      .single();

    if (fetchError || !version) {
      return NextResponse.json(
        { error: 'Version non trouvée' },
        { status: 404 }
      );
    }

    if (!version.is_active) {
      return NextResponse.json(
        { error: 'Cette version n\'est pas active' },
        { status: 400 }
      );
    }

    // Vérifier si des outils utilisent ce prompt
    const { data: toolsUsingPrompt } = await supabaseAdmin
      .from('ai_tools')
      .select('id, name')
      .eq('prompt_id', params.id)
      .eq('is_active', true);

    if (toolsUsingPrompt && toolsUsingPrompt.length > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de désactiver la version active d\'un prompt utilisé par des outils actifs',
          tools: toolsUsingPrompt
        },
        { status: 400 }
      );
    }

    // Désactiver la version
    const { data: deactivatedVersion, error: deactivateError } = await supabaseAdmin
      .from('ai_prompt_versions')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.versionId)
      .eq('prompt_id', params.id)
      .select()
      .single();

    if (deactivateError) {
      console.error('Erreur désactivation version:', deactivateError);
      return NextResponse.json(
        { error: 'Erreur lors de la désactivation' },
        { status: 500 }
      );
    }

    // Vérifier s'il reste des versions actives pour ce prompt
    const { data: activeVersions } = await supabaseAdmin
      .from('ai_prompt_versions')
      .select('id')
      .eq('prompt_id', params.id)
      .eq('is_active', true);

    // Si aucune version n'est active, désactiver le prompt parent
    if (!activeVersions || activeVersions.length === 0) {
      await supabaseAdmin
        .from('ai_prompts')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);
    }

    return NextResponse.json({
      success: true,
      version: deactivatedVersion,
      message: `Version ${version.version} désactivée avec succès`
    });
  } catch (error) {
    console.error('Erreur désactivation version:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}