import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/v2/categories - Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'
    
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: includeStats ? {
        _count: {
          select: {
            packs: true
          }
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    })

    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      isActive: cat.isActive,
      packsCount: includeStats && '_count' in cat ? cat._count.packs : undefined,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt
    }))

    return NextResponse.json({
      status: 'SUCCESS',
      data: formattedCategories,
      count: categories.length,
      message: includeStats ? 'Catégories avec statistiques' : 'Catégories actives'
    })

  } catch (error) {
    console.error('Erreur récupération catégories:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la récupération des catégories',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

// POST /api/v2/categories - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, isActive = true } = body

    if (!name || !slug) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Nom et slug requis'
      }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        isActive
      }
    })

    return NextResponse.json({
      status: 'SUCCESS',
      data: category,
      message: 'Catégorie créée avec succès'
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur création catégorie:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création de la catégorie',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 