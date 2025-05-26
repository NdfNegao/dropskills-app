import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Middleware d'authentification pour n8n
function authenticateN8N(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === process.env.N8N_API_KEY
}

// GET /api/n8n/users - Récupérer les utilisateurs
export async function GET(request: NextRequest) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const email = searchParams.get('email')
    const role = searchParams.get('role')
    const status = searchParams.get('status')

    const where: any = {}
    if (email) where.email = { contains: email, mode: 'insensitive' }
    if (role) where.role = role
    if (status) where.status = status

    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        packsPurchased: {
          include: {
            pack: {
              select: { id: true, title: true }
            }
          }
        },
        _count: {
          select: {
            iaToolUsage: true,
            supportTickets: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.user.count({ where })

    return NextResponse.json({
      users,
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

// POST /api/n8n/users - Créer un utilisateur
export async function POST(request: NextRequest) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        provider: data.provider || 'EMAIL',
        role: data.role || 'USER',
        status: data.status || 'ACTIVE',
        subscriptionType: data.subscriptionType || 'FREE'
      },
      include: {
        packsPurchased: true
      }
    })

    return NextResponse.json(user, { status: 201 })

  } catch (error) {
    console.error('Erreur POST user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 