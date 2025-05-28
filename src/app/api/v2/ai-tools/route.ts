import { NextRequest, NextResponse } from 'next/server'
import { SupabaseHelper, supabase } from '@/lib/supabase'

// Outils IA par défaut à créer si la table est vide
const DEFAULT_AI_TOOLS = [
  {
    name: 'ICP Maker',
    description: 'Créez votre profil client idéal en quelques minutes',
    tool_type: 'ICP_MAKER' as const,
    is_active: true
  },
  {
    name: 'Générateur d\'Offres',
    description: 'Générez des offres irrésistibles avec l\'IA',
    tool_type: 'OFFER_GENERATOR' as const,
    is_active: true
  },
  {
    name: 'Générateur de Titres',
    description: 'Créez des titres accrocheurs pour vos contenus',
    tool_type: 'TITLE_GENERATOR' as const,
    is_active: true
  },
  {
    name: 'Content System',
    description: 'Planifiez votre contenu sur 4 semaines',
    tool_type: 'CONTENT_SYSTEM' as const,
    is_active: true
  },
  {
    name: 'Tunnel Builder',
    description: 'Construisez des tunnels de vente optimisés',
    tool_type: 'TUNNEL_BUILDER' as const,
    is_active: true
  },
  {
    name: 'Email Sequence',
    description: 'Créez des séquences email automatisées',
    tool_type: 'EMAIL_SEQUENCE' as const,
    is_active: true
  },
  {
    name: 'Lead Magnet',
    description: 'Générez des lead magnets irrésistibles',
    tool_type: 'LEAD_MAGNET' as const,
    is_active: true
  },
  {
    name: 'Veille Stratégique',
    description: 'Analysez votre marché et trouvez des opportunités',
    tool_type: 'VEILLE_STRATEGIQUE' as const,
    is_active: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeUsage = searchParams.get('usage') === 'true'
    const isActive = searchParams.get('active')
    
    // Construire les options de filtre
    const whereOptions: any = {}
    if (isActive !== null) {
      whereOptions.is_active = isActive === 'true'
    }

    const aiTools = await SupabaseHelper.findManyAiTools({
      where: whereOptions
    })

    // Si usage demandé, on peut ajouter le count d'utilisation
    let toolsWithUsage = aiTools
    if (includeUsage) {
      // Pour chaque outil, compter les utilisations
      toolsWithUsage = await Promise.all(
        aiTools.map(async (tool) => {
          const { count } = await supabase
            .from('ai_usage')
            .select('*', { count: 'exact', head: true })
            .eq('tool_id', tool.id)
          
          return {
            ...tool,
            usage_count: count || 0
          }
        })
      )
    }

    return NextResponse.json({
      success: true,
      data: toolsWithUsage,
      count: aiTools.length,
      message: includeUsage ? 'Outils IA avec statistiques d\'usage' : 'Outils IA récupérés'
    })

  } catch (error) {
    console.error('Erreur récupération outils IA:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des outils IA',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Action spéciale pour initialiser les outils par défaut
    if (body.action === 'init_default_tools') {
      const existingToolsCount = await SupabaseHelper.countAiTools()
      
      if (existingToolsCount > 0) {
        return NextResponse.json({
          success: false,
          message: 'Les outils IA existent déjà',
          data: await SupabaseHelper.findManyAiTools()
        })
      }

      // Créer tous les outils par défaut
      const createdTools = []
      for (const toolData of DEFAULT_AI_TOOLS) {
        const tool = await SupabaseHelper.createAiTool(toolData)
        createdTools.push(tool)
      }

      return NextResponse.json({
        success: true,
        message: `${createdTools.length} outils IA créés avec succès`,
        data: createdTools
      })
    }

    // Création d'un outil personnalisé
    if (!body.name || !body.tool_type) {
      return NextResponse.json(
        { success: false, error: 'Le nom et le type d\'outil sont requis' },
        { status: 400 }
      )
    }

    const aiTool = await SupabaseHelper.createAiTool({
      name: body.name,
      description: body.description,
      tool_type: body.tool_type,
      is_active: body.is_active !== undefined ? body.is_active : true
    })

    return NextResponse.json({
      success: true,
      data: aiTool,
      message: 'Outil IA créé avec succès'
    })

  } catch (error) {
    console.error('Erreur création outil IA:', error)
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Un outil avec ce nom existe déjà',
          details: error.message
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création de l\'outil IA',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 