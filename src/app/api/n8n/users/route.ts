import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, SupabaseHelper } from '@/lib/supabase'

// Middleware d'authentification pour n8n
function authenticateN8N(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === process.env.N8N_API_KEY
}

// GET /api/n8n/users - Récupérer les utilisateurs (profiles)
export async function GET(request: NextRequest) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const role = searchParams.get('role')

    const skip = (page - 1) * limit

    // Construction de la requête Supabase
    let query = supabase
      .from('profiles')
      .select('*')

    // Filtre par rôle si spécifié
    if (role) {
      query = query.eq('role', role)
    }

    // Pagination et tri
    query = query
      .range(skip, skip + limit - 1)
      .order('created_at', { ascending: false })

    const { data: profiles, error } = await query

    if (error) throw error

    // Compter le total
    let countQuery = supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    if (role) {
      countQuery = countQuery.eq('role', role)
    }

    const { count: total } = await countQuery

    // Pour chaque profil, récupérer les packs achetés et favoris
    const formattedProfiles = await Promise.all(
      (profiles || []).map(async (profile) => {
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

        return {
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
      })
    )

    return NextResponse.json({
      users: formattedProfiles, // Garde le nom "users" pour compatibilité avec N8N
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erreur GET users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/n8n/users - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const supabase = getSupabase()
    
    // Avec Supabase, nous devons d'abord créer l'utilisateur dans auth.users
    // puis créer le profil associé
    
    // Pour n8n, nous allons créer directement le profil avec un user_id généré
    // ou utiliser un utilisateur existant
    
    let userId = data.userId
    
    if (!userId) {
      // Générer un UUID pour l'utilisateur
      userId = crypto.randomUUID()
    }

    // Créer le profil
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role || 'USER'
      })
      .select()
      .single()

    if (error) throw error

    // Ajouter les informations utilisateur pour la compatibilité
    const responseProfile = {
      ...profile,
      user: {
        id: profile.user_id,
        email: data.email || `user-${profile.user_id}@example.com`,
        userPacks: [],
        favorites: []
      }
    }

    return NextResponse.json(responseProfile, { status: 201 })

  } catch (error) {
    console.error('Erreur POST user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 