import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAuthUserByEmail } from '@/lib/supabase-auth';
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

    // Récupérer l'utilisateur depuis auth.users via Supabase
    const authUser = await getAuthUserByEmail(session.user.email);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Utilisateur d\'authentification non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer ou créer le profil utilisateur
    let userProfile = await prisma.profile.findFirst({
      where: { id: authUser.id }
    });

    if (!userProfile) {
      // Créer automatiquement le profil s'il n'existe pas
      userProfile = await prisma.profile.create({
        data: {
          id: authUser.id,
          role: 'USER',
          status: 'ACTIVE'
        }
      });
    }

    const startTime = Date.now();

    // Créer la demande d'idées
    const ideaRequest = await prisma.product_requests.create({
      data: {
        user_id: userProfile.id,
        title: body.topic || 'Idée générée',
        description: body.targetAudience,
        status: 'IDEA',
        source: 'AI',
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
      
      const processingTime = Date.now() - startTime;

      // Mettre à jour le statut de la demande
      await prisma.product_requests.update({
        where: { id: ideaRequest.id },
        data: {
          status: 'COMPLETED'
        }
      });

      return NextResponse.json({
        success: true,
        ideas,
        requestId: ideaRequest.id,
        processingTime,
        source: 'openai'
      });

    } catch (error) {
      // Mettre à jour le statut en cas d'erreur
      await prisma.product_requests.update({
        where: { id: ideaRequest.id },
        data: {
          status: 'ERROR'
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

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Profil utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'historique des demandes d'idées de l'utilisateur
    const requests = await prisma.product_requests.findMany({
      where: { user_id: userProfile.id, source: 'AI' },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    return NextResponse.json({
      success: true,
      requests: requests.map(req => ({
        id: req.id,
        targetAudience: req.description,
        topic: req.title,
        status: req.status,
        createdAt: req.created_at
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