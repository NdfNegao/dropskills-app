import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AI_MENTORS } from '@/data/ai-mentors';
import type { AIMentor } from '@/types/ai-mentor';

export const dynamic = 'force-dynamic';

// Vérification des permissions admin
async function checkAdminPermissions() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || session.user.email !== 'cyril.iriebi@gmail.com') {
    return false;
  }
  
  return true;
}

// GET - Récupérer un mentor spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  try {
    const hasPermission = await checkAdminPermissions();
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { mentorId } = params;
    
    // TODO: Récupérer depuis la base de données
    const mentor = AI_MENTORS.find(m => m.id === mentorId);
    
    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mentor: {
        ...mentor,
        isActive: mentor.isActive !== false
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du mentor:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un mentor
export async function PUT(
  request: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  try {
    const hasPermission = await checkAdminPermissions();
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { mentorId } = params;
    const data = await request.json();
    
    // Validation des données
    if (!data.name || !data.description) {
      return NextResponse.json(
        { error: 'Le nom et la description sont requis' },
        { status: 400 }
      );
    }

    // TODO: Vérifier que le mentor existe en base
    const existingMentor = AI_MENTORS.find(m => m.id === mentorId);
    
    if (!existingMentor) {
      return NextResponse.json(
        { error: 'Mentor non trouvé' },
        { status: 404 }
      );
    }

    const updatedMentor: AIMentor = {
      id: mentorId,
      name: data.name,
      description: data.description,
      expertise: data.expertise || [],
      icon: data.icon || '🤖',
      theme: data.theme || {
        primary: '#3B82F6',
        secondary: '#EFF6FF',
        accent: '#1D4ED8'
      },
      link: data.link || '',
      isPopular: data.isPopular || false,
      estimatedResponseTime: data.estimatedResponseTime || '~2 min',
      conversationCount: data.conversationCount || existingMentor.conversationCount || 0,
      suggestedPrompts: data.suggestedPrompts || [],
      systemPrompt: data.systemPrompt || '',
      isActive: data.isActive !== false
    };

    // TODO: Mettre à jour en base de données
    console.log('Mentor mis à jour:', updatedMentor);

    return NextResponse.json({
      success: true,
      mentor: updatedMentor,
      message: 'Mentor mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mentor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du mentor' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un mentor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  try {
    const hasPermission = await checkAdminPermissions();
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { mentorId } = params;
    
    // TODO: Vérifier que le mentor existe en base
    const existingMentor = AI_MENTORS.find(m => m.id === mentorId);
    
    if (!existingMentor) {
      return NextResponse.json(
        { error: 'Mentor non trouvé' },
        { status: 404 }
      );
    }

    // TODO: Supprimer de la base de données
    // Vérifier s'il y a des conversations en cours
    console.log('Mentor supprimé:', mentorId);

    return NextResponse.json({
      success: true,
      message: 'Mentor supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du mentor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du mentor' },
      { status: 500 }
    );
  }
}