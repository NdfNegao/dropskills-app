import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/v2/categories - Récupérer toutes les catégories
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'
    
    const { data: categories = [], error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
    if (error) throw error

    // Si stats demandées, on peut ajouter le count des packs par catégorie
    let categoriesWithStats = categories
    if (includeStats) {
      // Pour chaque catégorie, compter les packs
      categoriesWithStats = await Promise.all(
        categories.map(async (category) => {
          const { count } = await supabase
            .from('packs')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('status', 'PUBLISHED')
          
          return {
            ...category,
            packs_count: count || 0
          }
        })
      )
    }

    return NextResponse.json({
      success: true,
      data: categoriesWithStats,
      count: categories.length,
      message: includeStats ? 'Catégories avec statistiques' : 'Catégories récupérées'
    })

  } catch (error) {
    console.error('Erreur récupération catégories:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des catégories',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// POST /api/v2/categories - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      )
    }

    // Générer le slug automatiquement
    const slug = body.slug || body.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Éviter les tirets multiples
      .trim()

    const { data: category, error: insertError } = await supabase
      .from('categories')
      .insert({
        name: body.name,
        slug: slug,
        is_active: body.is_active !== undefined ? body.is_active : true
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Catégorie créée avec succès'
    })

  } catch (error) {
    console.error('Erreur création catégorie:', error)
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Une catégorie avec ce nom ou slug existe déjà',
          details: error.message
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création de la catégorie',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 