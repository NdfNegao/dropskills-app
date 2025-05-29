import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// Middleware d'authentification pour n8n
function authenticateN8N(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === process.env.N8N_API_KEY
}

// GET /api/n8n/users/[id] - Récupérer un profil utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabase()
    
    // Récupérer le profil
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Récupérer les packs achetés
    const { data: userPacks } = await supabase
      .from('user_packs')
      .select(`
        *,
        pack:packs(id, title, status)
      `)
      .eq('user_id', profile.user_id)

    // Récupérer les favoris
    const { data: favorites } = await supabase
      .from('favorites')
      .select(`
        *,
        pack:packs(id, title, status)
      `)
      .eq('user_id', profile.user_id)

    // Reformater les données pour compatibilité
    const formattedProfile = {
      ...profile,
      user: {
        id: profile.user_id,
        email: `user-${profile.user_id}@example.com`, // Placeholder
        userPacks: userPacks || [],
        favorites: favorites || []
      },
      packsPurchased: (userPacks || []).map(up => up.pack),
      favorites: (favorites || []).map(f => f.pack)
    }

    return NextResponse.json(formattedProfile)

  } catch (error) {
    console.error('Erreur GET user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/n8n/users/[id] - Mettre à jour un profil utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const supabase = getSupabase()

    // Mettre à jour le profil
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Ajouter les informations utilisateur pour la compatibilité
    const responseProfile = {
      ...updatedProfile,
        user: {
        id: updatedProfile.user_id,
        email: data.email || `user-${updatedProfile.user_id}@example.com`,
        userPacks: [],
        favorites: []
        }
      }

    return NextResponse.json(responseProfile)

  } catch (error) {
    console.error('Erreur PUT user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/n8n/users/[id] - Supprimer un profil utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabase()
    
    // Supprimer le profil (les relations seront supprimées en cascade)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Profile deleted successfully' })

  } catch (error) {
    console.error('Erreur DELETE user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 