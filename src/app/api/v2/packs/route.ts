import { NextRequest, NextResponse } from 'next/server'
import { supabase, SupabaseHelper } from '@/lib/supabase'

// GET /api/v2/packs - Récupérer tous les packs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Construction de la requête Supabase simplifiée
    let query = supabase
      .from('packs')
      .select('*')
    
    // Filtres
    if (status) {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Pagination et tri
    query = query
      .range(skip, skip + limit - 1)
      .order('created_at', { ascending: false })

    const { data: packs, error, count } = await query

    if (error) {
      console.error('Erreur Supabase packs:', error)
      throw error
    }

    // Compter le total pour la pagination
    let countQuery = supabase
      .from('packs')
      .select('*', { count: 'exact', head: true })
    
    if (status) {
      countQuery = countQuery.eq('status', status)
    }
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { count: total } = await countQuery

    // Pour chaque pack, récupérer les relations séparément
    const formattedPacks = await Promise.all(
      (packs || []).map(async (pack) => {
        // Récupérer la catégorie
        let category = null
        if (pack.category_id) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', pack.category_id)
            .single()
          category = categoryData
        }

        // Récupérer le créateur
        let creator = null
        if (pack.creator_id) {
          const { data: creatorData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', pack.creator_id)
            .single()
          creator = creatorData
        }

        // Récupérer les samples
        const { data: samples } = await supabase
          .from('samples')
          .select('*')
          .eq('pack_id', pack.id)
          .limit(3)

        // Récupérer les stats
        const { data: stats } = await supabase
          .from('pack_stats')
          .select('*')
          .eq('pack_id', pack.id)
          .single()

        return {
          id: pack.id,
          title: pack.title,
          slug: pack.slug,
          description: pack.description,
          price: pack.price,
          status: pack.status,
          category: category,
          creator: creator,
          samples: samples || [],
          stats: stats ? {
            views: stats.views_count,
            favorites: stats.favorites_count,
            purchases: stats.purchases_count
          } : null,
          counts: {
            favorites: stats?.favorites_count || 0,
            userPacks: stats?.purchases_count || 0,
            samples: samples?.length || 0
          },
          createdAt: pack.created_at,
          updatedAt: pack.updated_at
        }
      })
    )

    return NextResponse.json({
      status: 'SUCCESS',
      data: formattedPacks,
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit)
      },
      message: `${total || 0} pack(s) trouvé(s)`
    })

  } catch (error) {
    console.error('Erreur récupération packs:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la récupération des packs',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

// POST /api/v2/packs - Créer un nouveau pack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.title) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Le titre est requis'
      }, { status: 400 })
    }

    // Génération du slug
    const slug = body.slug || body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Vérification de l'unicité du slug
    const { data: existingPack } = await supabase
      .from('packs')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingPack) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Un pack avec ce slug existe déjà'
      }, { status: 409 })
    }

    // Récupérer l'ID du créateur par email (ou utiliser un ID par défaut)
    let creatorId = body.creatorId
    if (!creatorId && body.creatorEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', body.creatorEmail) // Adapter selon votre logique
        .single()
      
      creatorId = profile?.user_id
    }

    // Création du pack
    const { data: newPack, error } = await supabase
      .from('packs')
      .insert({
        title: body.title,
        slug,
        description: body.description,
        price: body.price || 0,
        status: body.status || 'DRAFT',
        creator_id: creatorId || '00000000-0000-0000-0000-000000000000', // ID par défaut
        category_id: body.categoryId || null
      })
      .select()
      .single()

    if (error) throw error

    // Création des stats initiales
    await SupabaseHelper.createPackStats({
      pack_id: newPack.id,
      views_count: 0,
      favorites_count: 0,
      purchases_count: 0
    })

    return NextResponse.json({
      status: 'SUCCESS',
      data: newPack,
      message: 'Pack créé avec succès'
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur création pack:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création du pack',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 