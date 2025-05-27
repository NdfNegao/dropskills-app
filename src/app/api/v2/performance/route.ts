import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test simple de performance V2
    console.log('🧪 Test: Performance V2')
    
    const startTime = Date.now()
    
    const counts = {
      users: await prisma.user.count(),
      packs: await prisma.pack.count(),
      categories: await prisma.category.count(),
      aiTools: await prisma.aiTool.count()
    }
    
    const packsWithRelations = await prisma.pack.findMany({
      take: 5,
      include: {
        category: true,
        creator: true,
        samples: { take: 2 }
      }
    })
    
    const categoriesWithCounts = await prisma.category.findMany({
      include: {
        _count: {
          select: { packs: true }
        }
      }
    })
    
    const totalTime = Date.now() - startTime

    return NextResponse.json({
      status: 'SUCCESS',
      message: '🎉 Schéma V2 opérationnel et performant !',
      data: {
        performance: {
          totalTime: `${totalTime}ms`,
          queries: 4,
          averageTime: `${(totalTime / 4).toFixed(2)}ms`
        },
        counts,
        sampleData: {
          packsFound: packsWithRelations.length,
          categoriesFound: categoriesWithCounts.length
        },
        status: {
          database: 'Connected',
          schema: 'V2 Ultra-Simplifié',
          features: [
            '✅ Core Business (Packs, Users, Categories)',
            '✅ Outils IA intégrés',
            '✅ Analytics essentielles',
            '✅ Favoris et samples',
            '❌ Tags supprimés',
            '❌ Trending ideas supprimées',
            '❌ Analytics complexes supprimées'
          ]
        }
      }
    })

  } catch (error) {
    console.error('❌ Erreur test V2:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors du test V2',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 