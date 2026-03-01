import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AI_MENTORS } from '@/data/ai-mentors';
import type { AIMentor } from '@/types/ai-mentor';

// Vérification des permissions admin
async function checkAdminPermissions() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || session.user.email !== 'cyril.iriebi@gmail.com') {
    return false;
  }
  
  return true;
}

// GET - Récupérer tous les mentors
export async function GET() {
  try {
    const hasPermission = await checkAdminPermissions();
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Pour l'instant, on retourne les données statiques
    // TODO: Implémenter la récupération depuis la base de données
    const mentors = AI_MENTORS.map(mentor => ({
      ...mentor,
      isActive: mentor.isActive !== false // Par défaut actif si non spécifié
    }));

    return NextResponse.json({
      success: true,
      mentors,
      total: mentors.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des mentors:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau mentor
export async function POST(request: NextRequest) {
  try {
    const hasPermission = await checkAdminPermissions();
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    // Validation des données
    if (!data.name || !data.description) {
      return NextResponse.json(
        { error: 'Le nom et la description sont requis' },
        { status: 400 }
      );
    }

    // Générer un ID unique
    const newId = `mentor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newMentor: AIMentor = {
      id: newId,
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
      conversationCount: data.conversationCount || 0,
      suggestedPrompts: data.suggestedPrompts || [],
      systemPrompt: data.systemPrompt || '',
      isActive: data.isActive !== false
    };

    // TODO: Sauvegarder en base de données
    // Pour l'instant, on simule la création
    console.log('Nouveau mentor créé:', newMentor);

    return NextResponse.json({
      success: true,
      mentor: newMentor,
      message: 'Mentor créé avec succès'
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du mentor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du mentor' },
      { status: 500 }
    );
  }
}