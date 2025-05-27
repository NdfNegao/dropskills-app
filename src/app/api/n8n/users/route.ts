import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const role = searchParams.get('role')

    const where: any = {}
    if (role) where.role = role

    const profiles = await prisma.profile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          include: {
            userPacks: {
              include: {
                pack: {
                  select: { id: true, title: true, status: true }
                }
              }
            },
            favorites: {
              include: {
                pack: {
                  select: { id: true, title: true, status: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.profile.count({ where })

    // Reformater les données pour compatibilité
    const formattedProfiles = profiles.map(profile => ({
      ...profile,
      packsPurchased: profile.user.userPacks.map(up => up.pack),
      favorites: profile.user.favorites.map(f => f.pack)
    }))

    return NextResponse.json({
      users: formattedProfiles, // Garde le nom "users" pour compatibilité avec N8N
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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
    
    // Créer d'abord l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName
      }
    })

    // Puis créer le profil associé
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'USER'
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(profile, { status: 201 })

  } catch (error) {
    console.error('Erreur POST user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 