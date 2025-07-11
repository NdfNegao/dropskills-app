import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const results: any = {}
    
    // Test d'existence des tables
    const tables = ['profiles', 'packs', 'categories', 'ai_tools', 'samples', 'favorites', 'user_packs', 'pack_stats', 'admin_logs', 'ai_usage']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          results[table] = `❌ Erreur: ${error.message}`
        } else {
          results[table] = `✅ Table existe (${data?.length || 0} enregistrements testés)`
        }
      } catch (error) {
        results[table] = `❌ Exception: ${error instanceof Error ? error.message : 'Inconnue'}`
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Test d\'existence des tables Supabase',
      timestamp: new Date().toISOString(),
      data: results
    })

  } catch (error) {
    console.error('Erreur test V2:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors du test V2',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Test de création d'un pack avec Supabase
    const { data: pack, error: packError } = await supabase.from('packs').insert({
      title: body.title || 'Pack de test Supabase',
      slug: body.slug || `pack-test-supabase-${Date.now()}`,
      description: body.description || 'Pack créé pour tester Supabase',
      price: body.price || 99.99,
      status: 'DRAFT',
      creator_id: body.creator_id || '00000000-0000-0000-0000-000000000000' // ID par défaut pour test
    }).select().single()
    if (packError) throw packError

    // Test de création d'un sample associé
    const { data: sample, error: sampleError } = await supabase.from('samples').insert({
      title: 'Sample de test Supabase',
      description: 'Sample créé pour tester Supabase',
      pack_id: pack.id as string,
      file_url: 'https://example.com/sample.pdf'
    }).select().single()
    if (sampleError) throw sampleError

    // Test de création de stats
    const { data: stats, error: statsError } = await supabase.from('pack_stats').insert({
      pack_id: pack.id as string,
      views_count: 0,
      favorites_count: 0,
      purchases_count: 0
    }).select().single()
    if (statsError) throw statsError

    return NextResponse.json({
      success: true,
      message: 'Création test réussie avec Supabase !',
      data: {
        pack,
        sample,
        stats
      }
    })

  } catch (error) {
    console.error('Erreur création test V2:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création test V2',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 