import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
      include: {
        packsPurchased: true,
        products: {
          select: { id: true, title: true, status: true }
        },
        product_requests: {
          select: { id: true, title: true, status: true }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)

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
    
    const profile = await prisma.profile.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        status: data.status,
        avatar_url: data.avatar_url
      },
      include: {
        packsPurchased: true,
        products: true
      }
    })

    return NextResponse.json(profile)

  } catch (error) {
    console.error('Erreur PUT user:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
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
    await prisma.profile.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Profile deleted successfully' })

  } catch (error) {
    console.error('Erreur DELETE user:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 