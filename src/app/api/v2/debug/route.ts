import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const results = {
      connection: null,
      auth: null,
      policies: null,
      testInsert: null
    }

    // 1. Test de connexion
    const { data: connectionTest, error: connectionError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    results.connection = connectionError ? 
      { error: connectionError.message } : 
      { success: true, data: connectionTest }

    // 2. Test d'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    results.auth = {
      user: user?.id || 'anonymous',
      error: authError?.message || null
    }

    // 3. Test des politiques
    const { data: policies, error: policiesError } = await supabase
      .rpc('pg_policies')
      .select('*')
      .limit(5)

    results.policies = policiesError ? 
      { error: policiesError.message } : 
      { count: policies?.length || 0 }

    // 4. Test d'insertion simple
    const testCategory = {
      name: 'Test Debug',
      slug: 'test-debug-' + Date.now(),
      description: 'Catégorie de test pour debug'
    }

    const { data: insertTest, error: insertError } = await supabase
      .from('categories')
      .insert(testCategory)
      .select()
      .single()

    results.testInsert = insertError ? 
      { error: insertError.message, code: insertError.code } : 
      { success: true, id: insertTest?.id }

    return NextResponse.json({
      status: 'DEBUG',
      message: 'Tests de diagnostic Supabase',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors du diagnostic',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 