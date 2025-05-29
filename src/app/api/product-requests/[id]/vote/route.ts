import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { SupabaseHelper } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const requestId = params.id;
    const user = session.user as any;
    const userId = user.id || user.email;

    // Vérifier si l'utilisateur a déjà voté
    const existingVote = await SupabaseHelper.getUserVoteForRequest(requestId, userId);
    
    if (existingVote) {
      // Supprimer le vote (dé-voter)
      await SupabaseHelper.removeVoteFromRequest(requestId, userId);
      
      return NextResponse.json({
        success: true,
        action: 'removed',
        message: 'Vote retiré avec succès'
      });
    } else {
      // Ajouter le vote
      await SupabaseHelper.addVoteToRequest(requestId, userId, user.email);
      
      return NextResponse.json({
        success: true,
        action: 'added',
        message: 'Vote ajouté avec succès'
      });
    }

  } catch (error) {
    console.error('Erreur API vote:', error);
    
    if (error instanceof Error && error.message.includes('déjà voté')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors du vote' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const requestId = params.id;
    const user = session.user as any;
    const userId = user.id || user.email;

    // Vérifier si l'utilisateur a voté pour cette demande
    const userVote = await SupabaseHelper.getUserVoteForRequest(requestId, userId);
    
    return NextResponse.json({
      hasVoted: !!userVote,
      vote: userVote
    });

  } catch (error) {
    console.error('Erreur API vote GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du vote' },
      { status: 500 }
    );
  }
} 