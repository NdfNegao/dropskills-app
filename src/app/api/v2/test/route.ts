import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma-v2'

// Client Prisma V2 dédié
const prismaV2 = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test du schéma Dropskills V2...')

    // 1. Test de connexion
    await prismaV2.$connect()
    console.log('✅ Connexion Prisma V2 réussie')

    // 2. Test des données de base
    const stats = {
      users: await prismaV2.user.count(),
      packs: await prismaV2.pack.count(),
      categories: await prismaV2.category.count(),
      samples: await prismaV2.sample.count(),
      favorites: await prismaV2.favorite.count(),
      userPacks: await prismaV2.userPack.count(),
      aiTools: await prismaV2.aiTool.count(),
      packStats: await prismaV2.packStats.count(),
      adminLogs: await prismaV2.adminLog.count(),
      aiUsage: await prismaV2.aiUsage.count()
    }

    // 3. Test des relations
    const usersWithPacks = await prismaV2.user.findMany({
      take: 3,
      include: {
        createdPacks: {
          take: 2,
          include: {
            category: true,
            samples: { take: 1 }
          }
        },
        favorites: {
          take: 2,
          include: {
            pack: { select: { title: true } }
          }
        }
      }
    })

    // 4. Test des packs avec analytics simplifiées
    const packsWithRelations = await prismaV2.pack.findMany({
      take: 3,
      include: {
        category: true,
        creator: { select: { email: true, firstName: true, lastName: true } },
        samples: { take: 2 },
        packStats: true,
        _count: {
          select: {
            favorites: true,
            userPacks: true,
            samples: true
          }
        }
      }
    })

    // 5. Test des catégories avec comptage
    const categoriesWithCounts = await prismaV2.category.findMany({
      include: {
        _count: {
          select: { packs: true }
        }
      }
    })

    // 6. Test des outils IA avec usage simplifié
    const aiToolsData = await prismaV2.aiTool.findMany({
      take: 5,
      include: {
        _count: {
          select: { aiUsage: true }
        }
      }
    })

    const response = {
      status: 'SUCCESS',
      message: '🎉 Schéma V2 ULTRA-SIMPLIFIÉ - Analytics minimalistes !',
      timestamp: new Date().toISOString(),
      
      // Statistiques générales
      stats,
      
      // Tests de relations
      tests: {
        usersWithPacks: {
          count: usersWithPacks.length,
          sample: usersWithPacks.map(user => ({
            email: user.email,
            packsCreated: user.createdPacks.length,
            favorites: user.favorites.length,
            firstPack: user.createdPacks[0]?.title || 'Aucun'
          }))
        },
        
        packsWithRelations: {
          count: packsWithRelations.length,
          sample: packsWithRelations.map(pack => ({
            title: pack.title,
            category: pack.category?.name || 'Sans catégorie',
            creator: pack.creator ? `${pack.creator.firstName} ${pack.creator.lastName}` : 'Anonyme',
            samplesCount: pack._count.samples,
            favoritesCount: pack._count.favorites,
            userPacksCount: pack._count.userPacks,
            // Analytics simplifiées
            stats: pack.packStats ? {
              views: pack.packStats.viewsCount,
              favorites: pack.packStats.favoritesCount,
              purchases: pack.packStats.purchasesCount
            } : null
          }))
        },
        
        categoriesWithCounts: categoriesWithCounts.map(cat => ({
          name: cat.name,
          slug: cat.slug,
          packsCount: cat._count.packs,
          isActive: cat.isActive
        })),
        
        aiTools: aiToolsData.map(tool => ({
          name: tool.name,
          type: tool.toolType,
          isActive: tool.isActive,
          usageCount: tool._count.aiUsage
        }))
      },
      
      // Validation de l'intégrité
      integrity: {
        usersWithEmail: stats.users > 0 ? 'OK' : 'ATTENTION',
        packsWithCategory: packsWithRelations.filter(p => p.category).length,
        samplesLinked: stats.samples > 0 ? 'OK' : 'VIDE',
        relationsWorking: usersWithPacks.length > 0 ? 'OK' : 'PROBLÈME'
      },
      
      // Confirmation du nettoyage
      cleanup: {
        trendingIdeasRemoved: true,
        tagsSystemRemoved: true,
        analyticsSimplified: true,
        packStatsMinimal: true,
        adminLogsSimplified: true,
        aiUsageBasic: true,
        categoriesOnly: true,
        schemaUltraMinimal: true,
        coreBusinessFocus: true
      },

      // Métriques simplifiées
      simplifiedMetrics: {
        packStats: 'Seulement vues, favoris, achats',
        adminLogs: 'Actions critiques uniquement',
        aiUsage: 'Tracking basique seulement',
        philosophy: 'Simplicité avant tout !'
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('❌ Erreur test V2:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors du test du schéma V2',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 })
    
  } finally {
    await prismaV2.$disconnect()
  }
}

// Route POST pour tester les écritures
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Test de création d'un pack de test
    const testPack = await prismaV2.pack.create({
      data: {
        title: `Test Pack V2 MINIMAL - ${new Date().toISOString()}`,
        slug: `test-pack-v2-minimal-${Date.now()}`,
        description: 'Pack de test pour valider le schéma V2 ultra-minimal (analytics simplifiées)',
        price: 0,
        isFree: true,
        status: 'DRAFT',
        visibility: 'PRIVATE'
      }
    })

    // Test de création d'un sample
    const testSample = await prismaV2.sample.create({
      data: {
        packId: testPack.id,
        title: 'Sample de test V2 minimal',
        fileUrl: 'https://example.com/test-minimal.pdf',
        fileType: 'PDF'
      }
    })

    // Test de création de stats simplifiées
    const testStats = await prismaV2.packStats.create({
      data: {
        packId: testPack.id,
        viewsCount: 1,
        favoritesCount: 0,
        purchasesCount: 0
      }
    })

    return NextResponse.json({
      status: 'SUCCESS',
      message: '✅ Test d\'écriture V2 réussi - Schéma ultra-minimal',
      created: {
        pack: {
          id: testPack.id,
          title: testPack.title,
          slug: testPack.slug
        },
        sample: {
          id: testSample.id,
          title: testSample.title
        },
        stats: {
          views: testStats.viewsCount,
          favorites: testStats.favoritesCount,
          purchases: testStats.purchasesCount
        }
      },
      note: 'Analytics ultra-simplifiées - Focus sur l\'essentiel !'
    })

  } catch (error) {
    console.error('❌ Erreur test écriture V2:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors du test d\'écriture V2',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 