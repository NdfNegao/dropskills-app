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

    // 1. Récupérer les stats pour calculer les achievements
    const { data: toolLogs } = await supabase
      .from('ai_tool_logs')
      .select('tool_id, created_at, status')
      .eq('user_email', userEmail);

    const { data: opportunities } = await supabase
      .from('opportunities')
      .select('id')
      .eq('user_email', userEmail);

    // 2. Calculer les métriques
    const successfulLogs = toolLogs?.filter(log => log.status === 'success') || [];
    const uniqueTools = new Set(successfulLogs.map(log => log.tool_id));
    const toolsUsed = uniqueTools.size;
    const totalGenerations = successfulLogs.length;
    const totalOpportunities = opportunities?.length || 0;

    // 3. Calculer le score business
    let businessScore = 20;
    businessScore += Math.min(toolsUsed * 4, 20);
    businessScore += Math.min(totalGenerations * 0.6, 30);
    if (canAccessPremium) businessScore += 30;
    businessScore = Math.min(Math.round(businessScore), 100);

    // 4. Récupérer les achievements débloqués depuis la base
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_email', userEmail);

    const unlockedAchievements = new Set(
      userAchievements?.map(ua => ua.achievement_id) || []
    );

    // 5. Définir tous les achievements disponibles
    const achievements = [
      {
        id: 'first-tool',
        title: 'Premier Outil',
        description: 'Utilisez votre premier outil IA',
        icon: 'Bot',
        unlocked: toolsUsed >= 1,
        unlockedAt: toolsUsed >= 1 ? getFirstToolDate(toolLogs) : undefined,
        category: 'découverte'
      },
      {
        id: 'premium-user',
        title: 'Entrepreneur Premium',
        description: 'Passez au plan Premium',
        icon: 'Crown',
        unlocked: canAccessPremium,
        unlockedAt: canAccessPremium ? getPremiumDate(userEmail) : undefined,
        category: 'premium'
      },
      {
        id: 'power-user',
        title: 'Power User',
        description: 'Utilisez 5 outils différents',
        icon: 'Zap',
        unlocked: toolsUsed >= 5,
        progress: Math.min(100, (toolsUsed / 5) * 100),
        unlockedAt: toolsUsed >= 5 ? getMultiToolDate(toolLogs, 5) : undefined,
        category: 'expertise'
      },
      {
        id: 'business-expert',
        title: 'Expert Business',
        description: 'Atteignez un score business de 80+',
        icon: 'Trophy',
        unlocked: businessScore >= 80,
        progress: Math.min(100, (businessScore / 80) * 100),
        unlockedAt: businessScore >= 80 ? new Date().toISOString().split('T')[0] : undefined,
        category: 'maîtrise'
      },
      {
        id: 'generation-master',
        title: 'Maître Générateur',
        description: 'Générez 50 contenus avec l\'IA',
        icon: 'Sparkles',
        unlocked: totalGenerations >= 50,
        progress: Math.min(100, (totalGenerations / 50) * 100),
        unlockedAt: totalGenerations >= 50 ? getGenerationMasterDate(toolLogs, 50) : undefined,
        category: 'productivité'
      },
      {
        id: 'opportunity-hunter',
        title: 'Chasseur d\'Opportunités',
        description: 'Découvrez 10 opportunités business',
        icon: 'Target',
        unlocked: totalOpportunities >= 10,
        progress: Math.min(100, (totalOpportunities / 10) * 100),
        unlockedAt: totalOpportunities >= 10 ? getOpportunityDate(opportunities, 10) : undefined,
        category: 'stratégie'
      },
      {
        id: 'consistency-champion',
        title: 'Champion de Régularité',
        description: 'Utilisez DropSkills 7 jours consécutifs',
        icon: 'Calendar',
        unlocked: calculateStreak(toolLogs || []) >= 7,
        progress: Math.min(100, (calculateStreak(toolLogs || []) / 7) * 100),
        unlockedAt: calculateStreak(toolLogs || []) >= 7 ? getStreakDate(toolLogs, 7) : undefined,
        category: 'engagement'
      },
      {
        id: 'early-adopter',
        title: 'Adopteur Précoce',
        description: 'Parmi les premiers utilisateurs de DropSkills',
        icon: 'Star',
        unlocked: isEarlyAdopter(userEmail),
        unlockedAt: isEarlyAdopter(userEmail) ? '2024-01-01' : undefined,
        category: 'spécial'
      }
    ];

    // 6. Auto-débloquer les achievements nouvellement obtenus
    await autoUnlockAchievements(supabase, userEmail, achievements, unlockedAchievements);

    return NextResponse.json(achievements);

  } catch (error) {
    console.error('Erreur dashboard achievements:', error);
    
    // Fallback en cas d'erreur
    return NextResponse.json(getDefaultAchievements(false));
  }
}

// Fonctions utilitaires
function getFirstToolDate(toolLogs: any[]): string | undefined {
  if (!toolLogs?.length) return undefined;
  const firstLog = toolLogs
    .filter(log => log.status === 'success')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
  return firstLog?.created_at?.split('T')[0];
}

function getPremiumDate(userEmail: string): string {
  // Simulé - à remplacer par vraie logique
  return '2024-01-20';
}

function getMultiToolDate(toolLogs: any[], targetCount: number): string | undefined {
  if (!toolLogs?.length) return undefined;
  const successfulLogs = toolLogs.filter(log => log.status === 'success');
  const toolDates: Record<string, string> = {};
  
  successfulLogs.forEach(log => {
    if (!toolDates[log.tool_id]) {
      toolDates[log.tool_id] = log.created_at;
    }
  });
  
  const uniqueToolDates = Object.values(toolDates).sort();
  return uniqueToolDates[targetCount - 1]?.split('T')[0];
}

function getGenerationMasterDate(toolLogs: any[], targetCount: number): string | undefined {
  if (!toolLogs?.length) return undefined;
  const successfulLogs = toolLogs
    .filter(log => log.status === 'success')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  return successfulLogs[targetCount - 1]?.created_at?.split('T')[0];
}

function getOpportunityDate(opportunities: any[], targetCount: number): string | undefined {
  if (!opportunities?.length || opportunities.length < targetCount) return undefined;
  const sortedOpps = opportunities.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  return sortedOpps[targetCount - 1]?.created_at?.split('T')[0];
}

function calculateStreak(logs: any[]): number {
  if (!logs.length) return 0;
  
  const successfulLogs = logs
    .filter(log => log.status === 'success')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (!successfulLogs.length) return 0;

  const uniqueDays = [...new Set(
    successfulLogs.map(log => new Date(log.created_at).toISOString().split('T')[0])
  )].sort((a, b) => b.localeCompare(a));

  if (!uniqueDays.length) return 0;

  let streak = 1;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

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

function getStreakDate(toolLogs: any[], targetStreak: number): string | undefined {
  // Logique simplifiée - retourne la date il y a 7 jours
  return new Date(Date.now() - (targetStreak - 1) * 86400000).toISOString().split('T')[0];
}

function isEarlyAdopter(userEmail: string): boolean {
  // Liste des early adopters ou logique basée sur date de création
  const earlyAdopters = [
    'cyril.iriebi@gmail.com',
    // Ajouter d'autres emails d'early adopters
  ];
  return earlyAdopters.includes(userEmail);
}

async function autoUnlockAchievements(
  supabase: any, 
  userEmail: string, 
  achievements: any[], 
  unlockedAchievements: Set<string>
) {
  const newlyUnlocked = achievements.filter(
    achievement => achievement.unlocked && !unlockedAchievements.has(achievement.id)
  );

  for (const achievement of newlyUnlocked) {
    try {
      await supabase
        .from('user_achievements')
        .insert({
          user_email: userEmail,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString()
        });
    } catch (error) {
      console.error(`Erreur auto-unlock achievement ${achievement.id}:`, error);
    }
  }
}

function getDefaultAchievements(canAccessPremium: boolean) {
  return [
    {
      id: 'first-tool',
      title: 'Premier Outil',
      description: 'Utilisez votre premier outil IA',
      icon: 'Bot',
      unlocked: true,
      unlockedAt: '2024-01-15',
      category: 'découverte'
    },
    {
      id: 'premium-user',
      title: 'Entrepreneur Premium',
      description: 'Passez au plan Premium',
      icon: 'Crown',
      unlocked: canAccessPremium,
      unlockedAt: canAccessPremium ? '2024-01-20' : undefined,
      category: 'premium'
    },
    {
      id: 'power-user',
      title: 'Power User',
      description: 'Utilisez 5 outils différents',
      icon: 'Zap',
      unlocked: false,
      progress: 60,
      category: 'expertise'
    }
  ];
} 