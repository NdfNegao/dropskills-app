import { NextRequest, NextResponse } from 'next/server';
import { callN8nTool, PackCreateurInput } from '@/lib/n8n';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    const { niche, audience, format, niveau }: PackCreateurInput = body;

    if (!niche || !audience || !format || !niveau) {
      return NextResponse.json(
        { error: 'Données manquantes: niche, audience, format et niveau requis' },
        { status: 400 }
      );
    }

    // Validation des valeurs
    const validFormats = ['ebook', 'video', 'audio', 'template'];
    const validNiveaux = ['debutant', 'intermediaire', 'avance'];

    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Format invalide' },
        { status: 400 }
      );
    }

    if (!validNiveaux.includes(niveau)) {
      return NextResponse.json(
        { error: 'Niveau invalide' },
        { status: 400 }
      );
    }

    // Appel vers n8n
    const result = await callN8nTool({
      toolType: 'pack-createur',
      input: {
        niche,
        audience,
        format,
        niveau
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
      executionId: result.executionId
    });

  } catch (error) {
    console.error('Erreur Pack Créateur IA:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
} 