import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface GenerateIdeasRequest {
  targetAudience: string;
  topic?: string;
  formats?: string[];
}

interface PersonalizedIdea {
  title: string;
  description: string;
  targetAudience: string;
  marketSize: string;
  difficulty: 'FACILE' | 'MOYEN' | 'DIFFICILE';
  revenueEstimate: string;
  keyFeatures: string[];
  marketingStrategy: string;
  confidence?: number;
  tags?: string[];
  category?: string;
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

    const body: GenerateIdeasRequest = await request.json();
    
    if (!body.targetAudience?.trim()) {
      return NextResponse.json(
        { error: 'L\'audience cible est requise' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const startTime = Date.now();

    // Créer la demande d'idées
    const ideaRequest = await prisma.productIdeaRequest.create({
      data: {
        userId: user.id,
        targetAudience: body.targetAudience.trim(),
        topic: body.topic?.trim() || null,
        formats: body.formats ? JSON.stringify(body.formats) : null,
        status: 'PROCESSING'
      }
    });

    try {
      // Générer les idées (simulation pour l'instant)
      const ideas = await generatePersonalizedIdeas(body);
      
      // Sauvegarder les idées générées
      const savedIdeas = await Promise.all(
        ideas.map(idea => 
          prisma.productIdea.create({
            data: {
              requestId: ideaRequest.id,
              title: idea.title,
              description: idea.description,
              targetAudience: idea.targetAudience,
              marketSize: idea.marketSize,
              difficulty: idea.difficulty,
              revenueEstimate: idea.revenueEstimate,
              keyFeatures: JSON.stringify(idea.keyFeatures),
              marketingStrategy: idea.marketingStrategy,
              confidence: idea.confidence,
              tags: idea.tags ? JSON.stringify(idea.tags) : null,
              category: idea.category
            }
          })
        )
      );

      const processingTime = Date.now() - startTime;

      // Mettre à jour le statut de la demande
      await prisma.productIdeaRequest.update({
        where: { id: ideaRequest.id },
        data: {
          status: 'COMPLETED',
          processingTime,
          completedAt: new Date()
        }
      });

      // Retourner les idées avec les IDs de base de données
      const response = savedIdeas.map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        targetAudience: idea.targetAudience,
        marketSize: idea.marketSize,
        difficulty: idea.difficulty,
        revenue: idea.revenueEstimate,
        keyFeatures: JSON.parse(idea.keyFeatures),
        marketingStrategy: idea.marketingStrategy,
        confidence: idea.confidence,
        tags: idea.tags ? JSON.parse(idea.tags) : [],
        category: idea.category
      }));

      return NextResponse.json({
        success: true,
        ideas: response,
        requestId: ideaRequest.id,
        processingTime
      });

    } catch (error) {
      // Mettre à jour le statut en cas d'erreur
      await prisma.productIdeaRequest.update({
        where: { id: ideaRequest.id },
        data: {
          status: 'ERROR',
          errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
          processingTime: Date.now() - startTime
        }
      });

      throw error;
    }

  } catch (error) {
    console.error('Erreur lors de la génération d\'idées:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération des idées',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

async function generatePersonalizedIdeas(request: GenerateIdeasRequest): Promise<PersonalizedIdea[]> {
  // Simulation de génération d'idées avec IA
  // Dans une vraie implémentation, ici on appellerait OpenAI, Claude, ou un workflow n8n
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation du temps de traitement

  const { targetAudience, topic, formats } = request;
  
  const ideas: PersonalizedIdea[] = [];

  // Idée 1: Guide complet
  ideas.push({
    title: `Guide Complet pour ${targetAudience}`,
    description: `Un guide étape par étape spécialement conçu pour ${targetAudience}${topic ? ` dans le domaine ${topic}` : ''}. Ce guide couvre tous les aspects essentiels avec des exemples pratiques et des templates prêts à utiliser.`,
    targetAudience,
    marketSize: 'Marché de niche avec forte demande',
    difficulty: 'MOYEN',
    revenueEstimate: '800-3500€/mois',
    keyFeatures: [
      'Contenu personnalisé pour votre audience',
      'Templates et outils pratiques',
      'Études de cas réels',
      'Support communautaire',
      'Mises à jour régulières'
    ],
    marketingStrategy: 'Marketing de contenu + réseaux sociaux ciblés',
    confidence: 0.85,
    tags: ['guide', 'formation', topic || 'business'].filter(Boolean),
    category: topic || 'Business'
  });

  // Idée 2: Toolkit/Ressources
  ideas.push({
    title: `Toolkit ${topic || 'Business'} pour ${targetAudience}`,
    description: `Collection complète d'outils, templates et ressources essentiels pour ${targetAudience} souhaitant exceller${topic ? ` en ${topic}` : ' dans leur domaine'}. Inclut des checklist, frameworks et outils d'automatisation.`,
    targetAudience,
    marketSize: 'Marché en croissance avec potentiel élevé',
    difficulty: 'FACILE',
    revenueEstimate: '500-2000€/mois',
    keyFeatures: [
      'Outils prêts à utiliser',
      'Checklist et frameworks',
      'Templates personnalisables',
      'Vidéos explicatives',
      'Accès à vie'
    ],
    marketingStrategy: 'Partenariats + marketing d\'influence',
    confidence: 0.78,
    tags: ['toolkit', 'ressources', 'templates', topic || 'productivité'].filter(Boolean),
    category: 'Outils'
  });

  // Idée 3: Formation/Cours (si "Course" est dans les formats)
  if (!formats || formats.includes('Course')) {
    ideas.push({
      title: `Formation Complète ${topic || 'Business'} pour ${targetAudience}`,
      description: `Formation vidéo complète avec modules progressifs, exercices pratiques et certification. Spécialement adaptée aux besoins et défis de ${targetAudience}.`,
      targetAudience,
      marketSize: 'Marché premium avec forte valeur perçue',
      difficulty: 'DIFFICILE',
      revenueEstimate: '2000-8000€/mois',
      keyFeatures: [
        'Modules vidéo HD',
        'Exercices pratiques',
        'Certification incluse',
        'Groupe privé d\'entraide',
        'Sessions Q&A mensuelles'
      ],
      marketingStrategy: 'Webinaires gratuits + témoignages clients',
      confidence: 0.72,
      tags: ['formation', 'cours', 'certification', topic || 'éducation'].filter(Boolean),
      category: 'Formation'
    });
  }

  // Idée 4: Software/Outil (si "Software" est dans les formats)
  if (!formats || formats.includes('Software')) {
    ideas.push({
      title: `Outil ${topic || 'Business'} pour ${targetAudience}`,
      description: `Application web intuitive qui automatise les tâches répétitives de ${targetAudience}. Interface simple, résultats rapides et intégrations avec les outils populaires.`,
      targetAudience,
      marketSize: 'Marché SaaS en forte expansion',
      difficulty: 'DIFFICILE',
      revenueEstimate: '1500-6000€/mois',
      keyFeatures: [
        'Interface intuitive',
        'Automatisation avancée',
        'Intégrations multiples',
        'Rapports détaillés',
        'Support technique inclus'
      ],
      marketingStrategy: 'Freemium + démonstrations personnalisées',
      confidence: 0.68,
      tags: ['software', 'saas', 'automatisation', topic || 'productivité'].filter(Boolean),
      category: 'Logiciel'
    });
  }

  return ideas;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'historique des demandes d'idées de l'utilisateur
    const requests = await prisma.productIdeaRequest.findMany({
      where: { userId: user.id },
      include: {
        generatedIdeas: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      success: true,
      requests: requests.map(req => ({
        id: req.id,
        targetAudience: req.targetAudience,
        topic: req.topic,
        formats: req.formats ? JSON.parse(req.formats) : [],
        status: req.status,
        createdAt: req.createdAt,
        ideas: req.generatedIdeas.map(idea => ({
          id: idea.id,
          title: idea.title,
          description: idea.description,
          difficulty: idea.difficulty,
          revenue: idea.revenueEstimate,
          keyFeatures: JSON.parse(idea.keyFeatures),
          marketingStrategy: idea.marketingStrategy
        }))
      }))
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des idées:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des idées' },
      { status: 500 }
    );
  }
} 