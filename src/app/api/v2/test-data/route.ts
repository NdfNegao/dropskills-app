import { NextRequest, NextResponse } from 'next/server'
import { supabase, SupabaseHelper } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const results = {
      categories: [],
      profiles: [],
      packs: [],
      samples: [],
      userPacks: [],
      favorites: [],
      aiTools: [],
      packStats: []
    }

    // 1. Créer des catégories de test (structure correcte)
    const categories = [
      { name: 'Marketing Digital Test', slug: 'marketing-digital-test', is_active: true },
      { name: 'Copywriting Test', slug: 'copywriting-test', is_active: true },
      { name: 'Design Test', slug: 'design-test', is_active: true }
    ]

    for (const cat of categories) {
      const { data: category, error } = await supabase
        .from('categories')
        .upsert(cat, { onConflict: 'slug' })
        .select()
        .single()

      if (!error && category) {
        results.categories.push(category)
      } else if (error) {
        console.error('Erreur création catégorie:', error)
      }
    }

    // 2. Créer des profils de test
    const testUsers = [
      { 
        user_id: '11111111-1111-1111-1111-111111111111',
        first_name: 'John',
        last_name: 'Doe',
        role: 'USER'
      },
      { 
        user_id: '22222222-2222-2222-2222-222222222222',
        first_name: 'Jane',
        last_name: 'Smith',
        role: 'PREMIUM'
      },
      { 
        user_id: '33333333-3333-3333-3333-333333333333',
        first_name: 'Admin',
        last_name: 'Test',
        role: 'ADMIN'
      }
    ]

    for (const user of testUsers) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .upsert(user, { onConflict: 'user_id' })
        .select()
        .single()

      if (!error && profile) {
        results.profiles.push(profile)
      } else if (error) {
        console.error('Erreur création profil:', error)
      }
    }

    // 3. Créer des packs de test
    const testPacks = [
      {
        title: 'Pack Marketing Complet',
        slug: 'pack-marketing-complet',
        description: 'Un pack complet avec tous les outils marketing essentiels',
        price: 97,
        status: 'PUBLISHED',
        creator_id: '33333333-3333-3333-3333-333333333333',
        category_id: results.categories[0]?.id
      },
      {
        title: 'Templates Copywriting Pro',
        slug: 'templates-copywriting-pro',
        description: 'Collection de templates de copywriting haute conversion',
        price: 47,
        status: 'PUBLISHED',
        creator_id: '33333333-3333-3333-3333-333333333333',
        category_id: results.categories[1]?.id
      },
      {
        title: 'Pack Design Gratuit',
        slug: 'pack-design-gratuit',
        description: 'Ressources de design gratuites pour démarrer',
        price: 0,
        status: 'PUBLISHED',
        creator_id: '33333333-3333-3333-3333-333333333333',
        category_id: results.categories[2]?.id
      }
    ]

    for (const pack of testPacks) {
      const { data: newPack, error } = await supabase
        .from('packs')
        .upsert(pack, { onConflict: 'slug' })
        .select()
        .single()

      if (!error && newPack) {
        results.packs.push(newPack)

        // Créer les stats pour chaque pack
        const { data: stats, error: statsError } = await supabase
          .from('pack_stats')
          .upsert({
            pack_id: newPack.id,
            views_count: Math.floor(Math.random() * 1000) + 100,
            favorites_count: Math.floor(Math.random() * 50) + 5,
            purchases_count: Math.floor(Math.random() * 20) + 1
          }, { onConflict: 'pack_id' })
          .select()
          .single()

        if (!statsError && stats) {
          results.packStats.push(stats)
        }
      } else if (error) {
        console.error('Erreur création pack:', error)
      }
    }

    // 4. Créer des samples pour les packs
    if (results.packs.length > 0) {
      const samples = [
        {
          pack_id: results.packs[0].id,
          title: 'Template Email Marketing',
          description: 'Template d\'email de bienvenue',
          file_url: 'https://example.com/sample1.pdf'
        },
        {
          pack_id: results.packs[0].id,
          title: 'Checklist SEO',
          description: 'Checklist complète pour optimiser votre SEO',
          file_url: 'https://example.com/sample2.pdf'
        },
        {
          pack_id: results.packs[1].id,
          title: 'Script de Vente',
          description: 'Script de vente haute conversion',
          file_url: 'https://example.com/sample3.docx'
        }
      ]

      for (const sample of samples) {
        const { data: newSample, error } = await supabase
          .from('samples')
          .insert(sample)
          .select()
          .single()

        if (!error && newSample) {
          results.samples.push(newSample)
        } else if (error) {
          console.error('Erreur création sample:', error)
        }
      }
    }

    // 5. Créer des achats de packs (user_packs)
    if (results.packs.length > 0 && results.profiles.length > 0) {
      const userPacks = [
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          pack_id: results.packs[2].id // Pack gratuit
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          pack_id: results.packs[0].id // Pack premium
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          pack_id: results.packs[1].id // Pack premium
        }
      ]

      for (const userPack of userPacks) {
        const { data: newUserPack, error } = await supabase
          .from('user_packs')
          .upsert(userPack, { onConflict: 'user_id,pack_id' })
          .select()
          .single()

        if (!error && newUserPack) {
          results.userPacks.push(newUserPack)
        } else if (error) {
          console.error('Erreur création user_pack:', error)
        }
      }
    }

    // 6. Créer des favoris
    if (results.packs.length > 0) {
      const favorites = [
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          pack_id: results.packs[0].id
        },
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          pack_id: results.packs[1].id
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          pack_id: results.packs[2].id
        }
      ]

      for (const favorite of favorites) {
        const { data: newFavorite, error } = await supabase
          .from('favorites')
          .upsert(favorite, { onConflict: 'user_id,pack_id' })
          .select()
          .single()

        if (!error && newFavorite) {
          results.favorites.push(newFavorite)
        } else if (error) {
          console.error('Erreur création favorite:', error)
        }
      }
    }

    // 7. Créer des outils IA de test (structure correcte)
    const aiTools = [
      {
        name: 'Générateur de Titres Test',
        description: 'Génère des titres accrocheurs pour vos contenus',
        tool_type: 'TITLE_GENERATOR',
        is_active: true
      },
      {
        name: 'Optimiseur de Copy Test',
        description: 'Optimise vos textes de vente pour maximiser les conversions',
        tool_type: 'CONTENT_SYSTEM',
        is_active: true
      },
      {
        name: 'Analyseur de Concurrence Test',
        description: 'Analyse la stratégie de vos concurrents',
        tool_type: 'VEILLE_STRATEGIQUE',
        is_active: true
      }
    ]

    for (const tool of aiTools) {
      const { data: newTool, error } = await supabase
        .from('ai_tools')
        .upsert(tool, { onConflict: 'name' })
        .select()
        .single()

      if (!error && newTool) {
        results.aiTools.push(newTool)
      } else if (error) {
        console.error('Erreur création ai_tool:', error)
      }
    }

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Données de test créées avec succès',
      data: results,
      summary: {
        categories: results.categories.length,
        profiles: results.profiles.length,
        packs: results.packs.length,
        samples: results.samples.length,
        userPacks: results.userPacks.length,
        favorites: results.favorites.length,
        aiTools: results.aiTools.length,
        packStats: results.packStats.length
      }
    })

  } catch (error) {
    console.error('Erreur création données de test:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création des données de test',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 