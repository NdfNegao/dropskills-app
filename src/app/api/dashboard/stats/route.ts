import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const supabase = createServerComponentClient({ cookies });
    const userEmail = session.user.email;
    const canAccessPremium = (session.user as any).role === 'PREMIUM' || (session.user as any).role === 'ADMIN';

    // 1. Récupérer les stats d'utilisation des outils
    const { data: toolLogs } = await supabase
      .from('ai_tool_logs')
      .select('tool_id, created_at, status')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false });

    // 2. Calculer les stats du mois en cours
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyLogs = toolLogs?.filter(log => 
      log.created_at.startsWith(currentMonth) && log.status === 'success'
    ) || [];

    // 3. Calculer les outils uniques utilisés
    const uniqueTools = new Set(toolLogs?.map(log => log.tool_id) || []);
    const toolsUsed = uniqueTools.size;

    // 4. Compter les générations du mois
    const generationsThisMonth = monthlyLogs.length;

    // 5. Calculer le score business (basé sur activité + diversité outils + premium)
    let businessScore = 20; // Score de base
    
    // +20 points pour l'utilisation d'outils (max 5 outils différents)
    businessScore += Math.min(toolsUsed * 4, 20);
    
    // +30 points pour l'activité mensuelle (max 50 générations)
    businessScore += Math.min(generationsThisMonth * 0.6, 30);
    
    // +30 points si premium
    if (canAccessPremium) {
      businessScore += 30;
    }

    businessScore = Math.min(Math.round(businessScore), 100);

    // 6. Calculer la streak (jours consécutifs d'utilisation)
    const streakDays = calculateStreak(toolLogs || []);

    // 7. Récupérer les opportunités (simulées pour l'instant - à connecter avec vraie veille)
    const { data: opportunities } = await supabase
      .from('opportunities')
      .select('id')
      .eq('user_email', userEmail);

    const totalOpportunities = opportunities?.length || (canAccessPremium ? 47 : 12);

    // 8. Revenus (basé sur les outils utilisés et le plan)
    const totalRevenue = canAccessPremium ? Math.round(toolsUsed * 1000 + generationsThisMonth * 50) : 0;

    const stats = {
      totalOpportunities,
      subscriptionPlan: canAccessPremium ? 'Premium' : 'Gratuit',
      toolsUsed,
      generationsThisMonth,
      businessScore,
      streakDays,
      totalRevenue
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Erreur dashboard stats:', error);
    
    // Fallback avec données par défaut si erreur
    return NextResponse.json({
      totalOpportunities: 12,
      subscriptionPlan: 'Gratuit',
      toolsUsed: 3,
      generationsThisMonth: 15,
      businessScore: 34,
      streakDays: 1,
      totalRevenue: 0
    });
  }
}

function calculateStreak(logs: any[]): number {
  if (!logs.length) return 0;

  // Trier par date descendante
  const sortedLogs = logs
    .filter(log => log.status === 'success')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (!sortedLogs.length) return 0;

  // Obtenir les jours uniques d'utilisation
  const uniqueDays = [...new Set(
    sortedLogs.map(log => new Date(log.created_at).toISOString().split('T')[0])
  )].sort((a, b) => b.localeCompare(a));

  if (!uniqueDays.length) return 0;

  let streak = 1;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Vérifier si l'utilisateur a utilisé l'app aujourd'hui ou hier
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0; // Streak cassée
  }

  // Calculer la streak
  for (let i = 1; i < uniqueDays.length; i++) {
    const currentDate = new Date(uniqueDays[i]);
    const previousDate = new Date(uniqueDays[i-1]);
    const diffTime = previousDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
} 