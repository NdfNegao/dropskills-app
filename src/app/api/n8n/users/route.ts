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
    const status = searchParams.get('status')

    const where: any = {}
    if (role) where.role = role
    if (status) where.status = status

    const profiles = await prisma.profile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        packsPurchased: true,
        products: {
          select: { id: true, title: true }
        },
        product_requests: {
          select: { id: true, title: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.profile.count({ where })

    return NextResponse.json({
      users: profiles, // Garde le nom "users" pour compatibilité avec N8N
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

// POST /api/n8n/users - Créer un profil utilisateur
export async function POST(request: NextRequest) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Vérifier que l'ID utilisateur existe dans auth.users
    if (!data.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const profile = await prisma.profile.create({
      data: {
        id: data.id, // ID de auth.users
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'USER',
        status: data.status || 'ACTIVE',
        avatar_url: data.avatar_url
      },
      include: {
        packsPurchased: true
      }
    })

    return NextResponse.json(profile, { status: 201 })

  } catch (error) {
    console.error('Erreur POST user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 