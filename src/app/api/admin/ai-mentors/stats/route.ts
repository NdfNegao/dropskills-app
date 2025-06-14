import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AI_MENTORS } from '@/data/ai-mentors';

// Vérification des permissions admin
async function checkAdminPermissions() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || session.user.email !== 'cyril.iriebi@gmail.com') {
    return false;
  }
  
  return true;
}

// GET - Récupérer les statistiques des mentors
export async function GET() {
  try {
    const hasPermission = await checkAdminPermissions();
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Calculer les statistiques à partir des données statiques
    // TODO: Remplacer par des requêtes en base de données
    const totalMentors = AI_MENTORS.length;
    const activeMentors = AI_MENTORS.filter(m => m.isActive !== false).length;
    const popularMentors = AI_MENTORS.filter(m => m.isPopular).length;
    const totalConversations = AI_MENTORS.reduce((sum, m) => sum + m.conversationCount, 0);
    
    // Trouver le mentor le plus actif
    const topMentor = AI_MENTORS.reduce((top, current) => {
      return current.conversationCount > (top?.conversationCount || 0) ? current : top;
    }, AI_MENTORS[0]);

    // Calculer le temps de réponse moyen
    const responseTimes = AI_MENTORS.map(m => {
      const timeStr = m.estimatedResponseTime.replace(/[^0-9]/g, '');
      return parseInt(timeStr) || 2;
    });
    const avgResponseTimeMinutes = Math.round(
      responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    );

    const stats = {
      totalMentors,
      activeMentors,
      popularMentors,
      totalConversations,
      avgResponseTime: `~${avgResponseTimeMinutes} min`,
      topMentor: topMentor ? {
        name: topMentor.name,
        conversations: topMentor.conversationCount
      } : null,
      // Statistiques additionnelles
      mentorsByCategory: {
        marketing: AI_MENTORS.filter(m => 
          m.expertise.some(e => e.toLowerCase().includes('marketing'))
        ).length,
        development: AI_MENTORS.filter(m => 
          m.expertise.some(e => 
            e.toLowerCase().includes('développement') || 
            e.toLowerCase().includes('code') ||
            e.toLowerCase().includes('programmation')
          )
        ).length,
        business: AI_MENTORS.filter(m => 
          m.expertise.some(e => 
            e.toLowerCase().includes('business') || 
            e.toLowerCase().includes('entreprise') ||
            e.toLowerCase().includes('stratégie')
          )
        ).length
      },
      recentActivity: {
        newMentorsThisMonth: 2, // Simulé
        conversationsThisWeek: Math.floor(totalConversations * 0.3), // Simulé
        averageRating: 4.7 // Simulé
      }
    };

    return NextResponse.json({
      success: true,
      stats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques des mentors:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}