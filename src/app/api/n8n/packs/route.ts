import { NextRequest, NextResponse } from 'next/server'
import { prisma, MockPrismaClient } from '@/lib/prisma'

function authenticateN8N(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === process.env.N8N_API_KEY
}

// GET /api/n8n/packs - Récupérer les packs
export async function GET(request: NextRequest) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const visibility = searchParams.get('visibility')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')

    const where: any = {}
    if (visibility) where.visibility = visibility
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId

    const packs = await prisma.pack.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        creator: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        category: true,
        stats: true,
        files: true,
        _count: {
          select: {
            purchases: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.pack.count({ where })

    return NextResponse.json({
      packs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur GET packs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/n8n/packs - Créer un pack
export async function POST(request: NextRequest) {
  if (!authenticateN8N(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const pack = await prisma.pack.create({
      data: {
        title: data.title,
        description: data.description,
        shortDesc: data.shortDesc,
        image: data.image,
        tags: data.tags || [],
        price: data.price,
        visibility: data.visibility || 'DRAFT',
        status: data.status || 'ACTIVE',
        creatorId: data.creatorId,
        categoryId: data.categoryId,
        publishedAt: data.visibility === 'PUBLIC' ? new Date() : null
      },
      include: {
        creator: true,
        category: true,
        stats: true
      }
    })

    // Créer les statistiques initiales
    await prisma.packStats.create({
      data: {
        packId: pack.id
      }
    })

    return NextResponse.json(pack, { status: 201 })

  } catch (error) {
    console.error('Erreur POST pack:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 