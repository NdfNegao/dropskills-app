import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAuthUserByEmail } from '@/lib/supabase-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const minRevenue = searchParams.get('minRevenue');

    // Construire les filtres
    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }

    // Récupérer les idées tendances depuis la base de données
    let trendingIdeas = await prisma.trendingIdea.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { trendScore: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    });

    // Si aucune idée en base, créer des idées par défaut
    if (trendingIdeas.length === 0) {
      const defaultIdeas = [
        {
          title: 'Templates de Newsletters IA',
          description: 'Pack de templates de newsletters optimisés avec des prompts IA pour générer du contenu engageant automatiquement.',
          category: 'Marketing',
          difficulty: 'FACILE' as const,
          revenueEstimate: '500-2000€/mois',
          trendScore: 95,
          tags: JSON.stringify(['IA', 'Email Marketing', 'Templates']),
          isActive: true,
          isFeatured: true
        },
        {
          title: 'Calculateur de ROI SaaS',
          description: 'Outil interactif pour calculer le retour sur investissement des logiciels SaaS avec tableaux de bord personnalisés.',
          category: 'Business',
          difficulty: 'MOYEN' as const,
          revenueEstimate: '1000-5000€/mois',
          trendScore: 88,
          tags: JSON.stringify(['SaaS', 'ROI', 'Analytics']),
          isActive: true,
          isFeatured: false
        },
        {
          title: 'Pack Créateur de Contenu TikTok',
          description: 'Scripts, hooks, et stratégies pour créer du contenu viral sur TikTok avec des templates prêts à utiliser.',
          category: 'Social Media',
          difficulty: 'FACILE' as const,
          revenueEstimate: '300-1500€/mois',
          trendScore: 92,
          tags: JSON.stringify(['TikTok', 'Viral', 'Scripts']),
          isActive: true,
          isFeatured: false
        },
        {
          title: 'Audit SEO Automatisé',
          description: 'Outil d\'audit SEO complet avec recommandations personnalisées et plan d\'action détaillé.',
          category: 'SEO',
          difficulty: 'DIFFICILE' as const,
          revenueEstimate: '2000-8000€/mois',
          trendScore: 85,
          tags: JSON.stringify(['SEO', 'Audit', 'Automatisation']),
          isActive: true,
          isFeatured: false
        },
        {
          title: 'Générateur de Personas Client',
          description: 'Créez des personas clients détaillés avec IA basés sur vos données et votre marché cible.',
          category: 'Marketing',
          difficulty: 'MOYEN' as const,
          revenueEstimate: '800-3000€/mois',
          trendScore: 90,
          tags: JSON.stringify(['Personas', 'IA', 'Marketing']),
          isActive: true,
          isFeatured: false
        }
      ];

      // Créer les idées par défaut en base
      await prisma.trendingIdea.createMany({
        data: defaultIdeas
      });

      // Récupérer les idées nouvellement créées
      trendingIdeas = await prisma.trendingIdea.findMany({
        where,
        orderBy: [
          { isFeatured: 'desc' },
          { trendScore: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 20
      });
    }

    // Filtrer par revenus minimum si spécifié
    let filteredIdeas = trendingIdeas;
    if (minRevenue) {
      const minRevenueNum = parseInt(minRevenue);
      filteredIdeas = trendingIdeas.filter(idea => {
        const revenueMatch = idea.revenueEstimate.match(/(\d+)/);
        if (revenueMatch) {
          const ideaMinRevenue = parseInt(revenueMatch[1]);
          return ideaMinRevenue >= minRevenueNum;
        }
        return true;
      });
    }

    // Formater les idées pour la réponse
    const formattedIdeas = filteredIdeas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      difficulty: idea.difficulty,
      revenue: idea.revenueEstimate,
      trend: idea.trendScore,
      tags: idea.tags ? JSON.parse(idea.tags) : []
    }));

    return NextResponse.json({
      success: true,
      ideas: formattedIdeas
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des idées tendances:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des idées tendances' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur depuis auth.users via Supabase
    const authUser = await getAuthUserByEmail(session.user.email);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Utilisateur d\'authentification non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer le profil utilisateur
    const userProfile = await prisma.profile.findFirst({
      where: { id: authUser.id }
    });

    if (!userProfile || !['ADMIN', 'SUPER_ADMIN'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Créer une nouvelle idée tendance
    const newIdea = await prisma.trendingIdea.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        revenueEstimate: body.revenueEstimate,
        trendScore: body.trendScore || 50,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false
      }
    });

    return NextResponse.json({
      success: true,
      idea: {
        id: newIdea.id,
        title: newIdea.title,
        description: newIdea.description,
        category: newIdea.category,
        difficulty: newIdea.difficulty,
        revenue: newIdea.revenueEstimate,
        trend: newIdea.trendScore,
        tags: newIdea.tags ? JSON.parse(newIdea.tags) : []
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'idée tendance:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'idée tendance' },
      { status: 500 }
    );
  }
} 