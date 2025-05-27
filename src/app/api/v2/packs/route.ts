import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma-v2'

const prismaV2 = new PrismaClient()

// GET /api/v2/packs - Récupérer tous les packs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'PUBLISHED'
    const isFree = searchParams.get('free')

    const skip = (page - 1) * limit

    // Construction des filtres
    const where: any = {
      status: status,
      visibility: 'PUBLIC'
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (isFree === 'true') {
      where.isFree = true
    }

    // Récupération des packs avec relations
    const [packs, total] = await Promise.all([
      prismaV2.pack.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          creator: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true }
          },
          samples: {
            take: 3,
            select: { id: true, title: true, fileType: true }
          },
          packStats: {
            select: { viewsCount: true, favoritesCount: true, purchasesCount: true }
          },
          _count: {
            select: { samples: true, favorites: true, userPacks: true }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prismaV2.pack.count({ where })
    ])

    // Formatage des données
    const formattedPacks = packs.map(pack => ({
      id: pack.id,
      title: pack.title,
      slug: pack.slug,
      description: pack.description,
      shortDescription: pack.shortDescription,
      price: pack.price,
      originalPrice: pack.originalPrice,
      currency: pack.currency,
      coverImageUrl: pack.coverImageUrl,
      previewVideoUrl: pack.previewVideoUrl,
      isFree: pack.isFree,
      isFeatured: pack.isFeatured,
      difficultyLevel: pack.difficultyLevel,
      estimatedDuration: pack.estimatedDuration,
      publishedAt: pack.publishedAt,
      
      // Relations
      category: pack.category,
      creator: pack.creator,
      samples: pack.samples,
      
      // Stats
      stats: {
        views: pack.packStats?.viewsCount || 0,
        favorites: pack.packStats?.favoritesCount || 0,
        purchases: pack.packStats?.purchasesCount || 0,
        samplesCount: pack._count.samples,
        userPacksCount: pack._count.userPacks
      }
    }))

    const response = {
      status: 'SUCCESS',
      data: {
        packs: formattedPacks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        filters: {
          category,
          search,
          status,
          isFree: isFree === 'true'
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v2',
        schema: 'dropskills_v2'
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Erreur GET /api/v2/packs:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la récupération des packs',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  } finally {
    await prismaV2.$disconnect()
  }
}

// POST /api/v2/packs - Créer un nouveau pack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données requises
    if (!body.title || !body.creatorId) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Titre et créateur requis'
      }, { status: 400 })
    }

    // Génération du slug
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Vérification de l'unicité du slug
    const existingPack = await prismaV2.pack.findUnique({
      where: { slug }
    })

    if (existingPack) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Un pack avec ce slug existe déjà'
      }, { status: 409 })
    }

    // Création du pack
    const newPack = await prismaV2.pack.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        shortDescription: body.shortDescription,
        price: body.price || 0,
        originalPrice: body.originalPrice,
        currency: body.currency || 'EUR',
        coverImageUrl: body.coverImageUrl,
        previewVideoUrl: body.previewVideoUrl,
        categoryId: body.categoryId,
        creatorId: body.creatorId,
        difficultyLevel: body.difficultyLevel,
        estimatedDuration: body.estimatedDuration,
        status: body.status || 'DRAFT',
        visibility: body.visibility || 'PRIVATE',
        isFree: body.price === 0 || body.isFree === true,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription
      },
      include: {
        category: true,
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    })

    // Création des stats initiales
    await prismaV2.packStats.create({
      data: {
        packId: newPack.id
      }
    })

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Pack créé avec succès',
      data: {
        pack: newPack
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Erreur POST /api/v2/packs:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création du pack',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  } finally {
    await prismaV2.$disconnect()
  }
} 