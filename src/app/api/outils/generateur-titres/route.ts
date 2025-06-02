import { NextRequest, NextResponse } from 'next/server';
import { processAiTool, GenerateurTitresInput } from '@/lib/ai-tools';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Validation des données d'entrée
    const body = await request.json();
    const { sujet, type, emotion, nombreTitres }: GenerateurTitresInput = body;

    if (!sujet || !type || !emotion || !nombreTitres) {
      return NextResponse.json(
        { error: 'Données manquantes: sujet, type, emotion et nombreTitres requis' },
        { status: 400 }
      );
    }

    // Validation des valeurs
    const validTypes = ['article', 'video', 'ebook', 'formation'];
    const validEmotions = ['curiosite', 'urgence', 'benefice', 'probleme'];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Type invalide' },
        { status: 400 }
      );
    }

    if (!validEmotions.includes(emotion)) {
      return NextResponse.json(
        { error: 'Émotion invalide' },
        { status: 400 }
      );
    }

    if (nombreTitres < 1 || nombreTitres > 20) {
      return NextResponse.json(
        { error: 'Nombre de titres doit être entre 1 et 20' },
        { status: 400 }
      );
    }

    // Traitement avec notre système IA
    const result = await processAiTool({
      toolType: 'generateur-titres',
      input: {
        sujet,
        type,
        emotion,
        nombreTitres
      },
      userId: session.user.id
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors du traitement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Erreur Générateur de Titres:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
} 