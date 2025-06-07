import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/admin/ai-tools/[id]/duplicate - Dupliquer un outil IA
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis pour la duplication' },
        { status: 400 }
      );
    }

    // Récupérer l'outil source avec ses configurations
    const { data: sourceTool, error: fetchError } = await supabaseAdmin
      .from('ai_tools')
      .select(`
        *,
        ai_tool_configs(
          provider,
          model,
          parameters,
          is_active
        )
      `)
      .eq('id', params.id)
      .single();

    if (fetchError || !sourceTool) {
      return NextResponse.json(
        { error: 'Outil source non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le nom n'existe pas déjà
    const { data: existingTool } = await supabaseAdmin
      .from('ai_tools')
      .select('id')
      .eq('name', name)
      .single();

    if (existingTool) {
      return NextResponse.json(
        { error: 'Un outil avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Créer le nouvel outil
    const { data: newTool, error: createError } = await supabaseAdmin
      .from('ai_tools')
      .insert({
        name,
        description: description || `${sourceTool.description} (copie)`,
        category: sourceTool.category,
        path: generateToolPath(name),
        prompt_id: sourceTool.prompt_id,
        input_schema: sourceTool.input_schema,
        output_schema: sourceTool.output_schema,
        tags: sourceTool.tags,
        is_active: false, // Désactivé par défaut pour permettre la configuration
        created_by: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Erreur création outil dupliqué:', createError);
      return NextResponse.json(
        { error: 'Erreur lors de la duplication' },
        { status: 500 }
      );
    }

    // Dupliquer les configurations
    if (sourceTool.ai_tool_configs && sourceTool.ai_tool_configs.length > 0) {
      const configsToInsert = sourceTool.ai_tool_configs.map((config: any) => ({
        tool_id: newTool.id,
        provider: config.provider,
        model: config.model,
        parameters: config.parameters,
        is_active: config.is_active,
        created_at: new Date().toISOString()
      }));

      const { error: configError } = await supabaseAdmin
        .from('ai_tool_configs')
        .insert(configsToInsert);

      if (configError) {
        console.error('Erreur duplication configurations:', configError);
        // Ne pas faire échouer la duplication si les configs échouent
      }
    }

    // Récupérer l'outil complet avec ses configurations
    const { data: completeTool } = await supabaseAdmin
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
          description
        )
      `)
      .eq('id', newTool.id)
      .single();

    return NextResponse.json({
      success: true,
      tool: completeTool,
      message: `Outil "${name}" créé avec succès à partir de "${sourceTool.name}"`
    });
  } catch (error) {
    console.error('Erreur duplication outil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la duplication' },
      { status: 500 }
    );
  }
}

// Fonction pour générer un chemin d'outil basé sur le nom
function generateToolPath(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Éviter les tirets multiples
    .replace(/^-|-$/g, ''); // Supprimer les tirets en début/fin
}