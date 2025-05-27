import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/v2/packs - Récupérer tous les packs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    const where: any = {}
    
    if (category) {
      where.category = {
        slug: category
      }
    }
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [packs, total] = await Promise.all([
      prisma.pack.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true
            }
          },
          creator: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          samples: {
            take: 3,
            select: {
              id: true,
              title: true,
              fileUrl: true
            }
          },
          stats: true,
          _count: {
            select: {
              favorites: true,
              userPacks: true,
              samples: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.pack.count({ where })
    ])

    const formattedPacks = packs.map(pack => ({
      id: pack.id,
      title: pack.title,
      slug: pack.slug,
      description: pack.description,
      price: pack.price,
      status: pack.status,
      category: pack.category,
      creator: pack.creator,
      samples: pack.samples,
      stats: pack.stats ? {
        views: pack.stats.viewsCount,
        favorites: pack.stats.favoritesCount,
        purchases: pack.stats.purchasesCount
      } : null,
      counts: pack._count,
      createdAt: pack.createdAt,
      updatedAt: pack.updatedAt
    }))

    return NextResponse.json({
      status: 'SUCCESS',
      data: formattedPacks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      message: `${total} pack(s) trouvé(s)`
    })

  } catch (error) {
    console.error('Erreur récupération packs:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la récupération des packs',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

// POST /api/v2/packs - Créer un nouveau pack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.title) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Le titre est requis'
      }, { status: 400 })
    }

    // Génération du slug
    const slug = body.slug || body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Vérification de l'unicité du slug
    const existingPack = await prisma.pack.findUnique({
      where: { slug }
    })

    if (existingPack) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Un pack avec ce slug existe déjà'
      }, { status: 409 })
    }

    // Création du pack
    const newPack = await prisma.pack.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        price: body.price || 0,
        status: body.status || 'DRAFT',
        creator: {
          connectOrCreate: {
            where: { email: body.creatorEmail || 'admin@dropskills.com' },
            create: {
              email: body.creatorEmail || 'admin@dropskills.com',
              firstName: 'Admin',
              lastName: 'User'
            }
          }
        },
        category: body.categoryId ? {
          connect: { id: body.categoryId }
        } : undefined
      }
    })

    // Création des stats initiales
    await prisma.packStats.create({
      data: {
        packId: newPack.id
      }
    })

    return NextResponse.json({
      status: 'SUCCESS',
      data: newPack,
      message: 'Pack créé avec succès'
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur création pack:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création du pack',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 