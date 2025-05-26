import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function authenticateN8N(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === process.env.N8N_API_KEY
}

// GET /api/n8n/users/[id] - Récupérer un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        packsPurchased: {
          include: {
            pack: true
          }
        },
        iaToolUsage: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        supportTickets: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        notifications: {
          where: { isRead: false },
          take: 10
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error('Erreur GET user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/n8n/users/[id] - Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        status: data.status,
        subscriptionType: data.subscriptionType,
        subscriptionExpiresAt: data.subscriptionEndDate ? new Date(data.subscriptionEndDate) : undefined,
      },
      include: {
        packsPurchased: true
      }
    })

    return NextResponse.json(user)

  } catch (error) {
    console.error('Erreur PUT user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/n8n/users/[id] - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur DELETE user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 