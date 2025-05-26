import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateProductIdeas, type IdeaGenerationRequest } from '@/lib/openai';

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
      // Générer les idées avec OpenAI
      const openaiRequest: IdeaGenerationRequest = {
        targetAudience: body.targetAudience.trim(),
        topic: body.topic?.trim(),
        formats: body.formats
      };

      const ideas = await generateProductIdeas(openaiRequest);
      
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
        processingTime,
        source: 'openai'
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