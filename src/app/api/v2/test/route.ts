import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test: Route V2 avec schéma ultra-simplifié')
    
    const startTime = Date.now()
    
    // Compter les entités principales
    const stats = {
      users: await prisma.user.count(),
      packs: await prisma.pack.count(),
      categories: await prisma.category.count(),
      samples: await prisma.sample.count(),
      favorites: await prisma.favorite.count(),
      userPacks: await prisma.userPack.count(),
      aiTools: await prisma.aiTool.count(),
      packStats: await prisma.packStats.count(),
      adminLogs: await prisma.adminLog.count(),
      aiUsage: await prisma.aiUsage.count()
    }

    // Tests de relations
    const usersWithPacks = await prisma.user.findMany({
      take: 3,
      include: {
        userPacks: {
          include: {
            pack: {
              select: { title: true }
            }
          }
        }
      }
    })

    const packsWithRelations = await prisma.pack.findMany({
      take: 5,
      include: {
        category: { select: { name: true } },
        creator: { select: { firstName: true, lastName: true, email: true } },
        samples: { take: 2, select: { title: true } },
        favorites: { take: 1 },
        userPacks: { take: 1 },
        stats: true
      }
    })

    const categoriesWithCounts = await prisma.category.findMany({
      include: {
        _count: {
          select: { packs: true }
        }
      }
    })

    const aiTools = await prisma.aiTool.findMany({
      include: {
        _count: {
          select: { aiUsage: true }
        }
      }
    })

    const totalTime = Date.now() - startTime

    // Tests d'intégrité
    const integrity = {
      usersWithEmail: stats.users > 0 ? 'OK' : 'ATTENTION',
      packsWithCategory: packsWithRelations.filter(p => p.category).length,
      samplesLinked: stats.samples > 0 ? 'OK' : 'ATTENTION',
      relationsWorking: packsWithRelations.length > 0 ? 'OK' : 'PROBLÈME'
    }

    return NextResponse.json({
      status: 'SUCCESS',
      message: '🎉 Schéma V2 ULTRA-SIMPLIFIÉ - Analytics minimalistes !',
      timestamp: new Date().toISOString(),
      stats,
      tests: {
        usersWithPacks: {
          count: usersWithPacks.length,
          sample: usersWithPacks.map(u => ({
            email: u.email,
            packsCount: u.userPacks.length,
            packs: u.userPacks.map(up => up.pack.title)
          }))
        },
        packsWithRelations: {
          count: packsWithRelations.length,
          sample: packsWithRelations.map(p => ({
            title: p.title,
            category: p.category?.name || 'Sans catégorie',
            creator: p.creator.firstName && p.creator.lastName 
              ? `${p.creator.firstName} ${p.creator.lastName}` 
              : 'Anonyme',
            samplesCount: p.samples.length,
            favoritesCount: p.favorites.length,
            userPacksCount: p.userPacks.length,
            stats: p.stats ? {
              views: p.stats.viewsCount,
              favorites: p.stats.favoritesCount,
              purchases: p.stats.purchasesCount
            } : null
          }))
        },
        categoriesWithCounts: categoriesWithCounts.map(c => ({
          name: c.name,
          slug: c.slug,
          packsCount: c._count.packs,
          isActive: c.isActive
        })),
        aiTools: aiTools.map(t => ({
          name: t.name,
          type: t.toolType,
          isActive: t.isActive,
          usageCount: t._count.aiUsage
        }))
      },
      integrity,
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
      simplifiedMetrics: {
        packStats: 'Seulement vues, favoris, achats',
        adminLogs: 'Actions critiques uniquement',
        aiUsage: 'Tracking basique seulement',
        philosophy: 'Simplicité avant tout !'
      }
    })

  } catch (error) {
    console.error('❌ Erreur test V2:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors du test V2',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🧪 Test: Création de données V2', body)

    if (body.action === 'create_test_data') {
      const timestamp = new Date().toISOString()
      
      // Créer un pack de test
      const pack = await prisma.pack.create({
        data: {
          title: `Test Pack V2 MINIMAL - ${timestamp}`,
          slug: `test-pack-v2-minimal-${Date.now()}`,
          description: 'Pack de test pour validation V2 ultra-simplifié',
          price: 29.99,
          status: 'ACTIVE',
          creator: {
            connectOrCreate: {
              where: { email: 'test@dropskills.com' },
              create: {
                email: 'test@dropskills.com',
                firstName: 'Test',
                lastName: 'User'
              }
            }
          },
          category: {
            connectOrCreate: {
              where: { slug: 'test' },
              create: {
                name: 'Test Category',
                slug: 'test'
              }
            }
          }
        }
      })

      // Créer un sample
      const sample = await prisma.sample.create({
        data: {
          title: 'Sample de test V2 minimal',
          description: 'Échantillon pour validation schéma V2',
          fileUrl: 'https://example.com/sample.pdf',
          packId: pack.id
        }
      })

      // Créer des stats simplifiées
      const stats = await prisma.packStats.create({
        data: {
          packId: pack.id,
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
            id: pack.id,
            title: pack.title,
            slug: pack.slug
          },
          sample: {
            id: sample.id,
            title: sample.title
          },
          stats: {
            views: stats.viewsCount,
            favorites: stats.favoritesCount,
            purchases: stats.purchasesCount
          }
        },
        note: 'Analytics ultra-simplifiées - Focus sur l\'essentiel !'
      })
    }

    return NextResponse.json({
      status: 'ERROR',
      message: 'Action non reconnue'
    }, { status: 400 })

  } catch (error) {
    console.error('❌ Erreur création V2:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création V2',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 