import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/admin/prompts/[id]/duplicate - Dupliquer un prompt
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
    const { name, description, copyVersions = true } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis pour la duplication' },
        { status: 400 }
      );
    }

    // Récupérer le prompt source avec ses versions
    const { data: sourcePrompt, error: fetchError } = await supabaseAdmin
      .from('ai_prompts')
      .select(`
        *,
        ai_prompt_versions(
          version,
          content,
          system_prompt,
          parameters,
          changelog,
          is_active
        )
      `)
      .eq('id', params.id)
      .single();

    if (fetchError || !sourcePrompt) {
      return NextResponse.json(
        { error: 'Prompt source non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le nom n'existe pas déjà
    const { data: existingPrompt } = await supabaseAdmin
      .from('ai_prompts')
      .select('id')
      .eq('name', name)
      .single();

    if (existingPrompt) {
      return NextResponse.json(
        { error: 'Un prompt avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Créer le nouveau prompt
    const { data: newPrompt, error: createError } = await supabaseAdmin
      .from('ai_prompts')
      .insert({
        name,
        description: description || `${sourcePrompt.description} (copie)`,
        category: sourcePrompt.category,
        tags: sourcePrompt.tags,
        is_active: false, // Désactivé par défaut
        created_by: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Erreur création prompt dupliqué:', createError);
      return NextResponse.json(
        { error: 'Erreur lors de la duplication' },
        { status: 500 }
      );
    }

    // Dupliquer les versions si demandé
    if (copyVersions && sourcePrompt.ai_prompt_versions && sourcePrompt.ai_prompt_versions.length > 0) {
      const versionsToInsert = sourcePrompt.ai_prompt_versions.map((version: any, index: number) => ({
        prompt_id: newPrompt.id,
        version: version.version,
        content: version.content,
        system_prompt: version.system_prompt,
        parameters: version.parameters,
        changelog: index === 0 ? 'Version initiale (dupliquée)' : `${version.changelog} (dupliquée)`,
        is_active: version.is_active,
        created_by: session.user.id,
        created_at: new Date().toISOString()
      }));

      const { error: versionsError } = await supabaseAdmin
        .from('ai_prompt_versions')
        .insert(versionsToInsert);

      if (versionsError) {
        console.error('Erreur duplication versions:', versionsError);
        // Ne pas faire échouer la duplication si les versions échouent
      }
    } else {
      // Créer au moins une version de base si on ne copie pas les versions
      const activeVersion = sourcePrompt.ai_prompt_versions?.find((v: any) => v.is_active) || 
                           sourcePrompt.ai_prompt_versions?.[0];
      
      if (activeVersion) {
        await supabaseAdmin
          .from('ai_prompt_versions')
          .insert({
            prompt_id: newPrompt.id,
            version: 1,
            content: activeVersion.content,
            system_prompt: activeVersion.system_prompt,
            parameters: activeVersion.parameters,
            changelog: 'Version initiale (dupliquée)',
            is_active: true,
            created_by: session.user.id,
            created_at: new Date().toISOString()
          });
      }
    }

    // Récupérer le prompt complet avec ses versions
    const { data: completePrompt } = await supabaseAdmin
      .from('ai_prompts')
      .select(`
        *,
        ai_prompt_versions(
          id,
          version,
          content,
          system_prompt,
          parameters,
          changelog,
          is_active,
          created_at
        )
      `)
      .eq('id', newPrompt.id)
      .single();

    return NextResponse.json({
      success: true,
      prompt: completePrompt,
      message: `Prompt "${name}" créé avec succès à partir de "${sourcePrompt.name}"`
    });
  } catch (error) {
    console.error('Erreur duplication prompt:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la duplication' },
      { status: 500 }
    );
  }
}