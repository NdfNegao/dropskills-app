import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma-v2'

const prismaV2 = new PrismaClient()

// GET /api/v2/categories - Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'

    const categories = await prismaV2.category.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: includeStats ? {
          select: { packs: true }
        } : undefined
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      sortOrder: category.sortOrder,
      ...(includeStats && {
        stats: {
          packsCount: category._count?.packs || 0
        }
      })
    }))

    return NextResponse.json({
      status: 'SUCCESS',
      data: {
        categories: formattedCategories
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v2',
        total: categories.length
      }
    })

  } catch (error) {
    console.error('❌ Erreur GET /api/v2/categories:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la récupération des catégories',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  } finally {
    await prismaV2.$disconnect()
  }
}

// POST /api/v2/categories - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.name) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Le nom de la catégorie est requis'
      }, { status: 400 })
    }

    // Génération du slug
    const slug = body.slug || body.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Vérification de l'unicité
    const existingCategory = await prismaV2.category.findFirst({
      where: {
        OR: [
          { name: body.name },
          { slug: slug }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Une catégorie avec ce nom ou slug existe déjà'
      }, { status: 409 })
    }

    const newCategory = await prismaV2.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        icon: body.icon,
        color: body.color,
        sortOrder: body.sortOrder || 0
      }
    })

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Catégorie créée avec succès',
      data: {
        category: newCategory
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Erreur POST /api/v2/categories:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création de la catégorie',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  } finally {
    await prismaV2.$disconnect()
  }
} 