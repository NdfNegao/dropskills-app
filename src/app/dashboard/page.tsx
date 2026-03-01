'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import PageBentoLayout from '@/components/PageBentoLayout';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, TrendingUp, Users, Zap, Bot, Target, Plus, Crown,
  Rocket, Trophy, Star, Gift, 
  Lightbulb, ChevronRight, Brain,
  Award, Activity, BookOpen, Flame, ArrowUp, ArrowDown
} from 'lucide-react';

// Types
interface UserStats {
  totalOpportunities: number;
  subscriptionPlan: string;
  toolsUsed: number;
  generationsThisMonth: number;
  businessScore: number;
  streakDays: number;
  totalRevenue: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface RecentActivity {
  id: string;
  type: 'tool_used' | 'generation' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export default function SimpleDashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);


  const { user, canAccessPremium } = useAuth();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const statsResponse = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        setStats({
          totalOpportunities: canAccessPremium ? 47 : 12,
          subscriptionPlan: canAccessPremium ? 'Premium' : 'Gratuit',
          toolsUsed: canAccessPremium ? 12 : 3,
          generationsThisMonth: canAccessPremium ? 247 : 15,
          businessScore: canAccessPremium ? 87 : 34,
          streakDays: 7,
          totalRevenue: canAccessPremium ? 12450 : 0
        });
      }

      setAchievements([
        {
          id: '1',
          title: 'Premier pas',
          description: 'Utilisez votre premier outil IA',
          icon: 'rocket',
          unlocked: true,
          progress: 1,
          maxProgress: 1
        },
        {
          id: '2',
          title: 'Productif',
          description: 'Générez 50 contenus ce mois',
          icon: 'zap',
          unlocked: canAccessPremium,
          progress: stats?.generationsThisMonth || 15,
          maxProgress: 50
        },
        {
          id: '3',
          title: 'Explorateur',
          description: 'Testez 10 outils différents',
          icon: 'compass',
          unlocked: false,
          progress: stats?.toolsUsed || 3,
          maxProgress: 10
        }
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'tool_used',
          title: 'ICP Maker utilisé',
          description: 'Création d\'un profil client pour le secteur SaaS',
          timestamp: '2 heures',
          icon: 'target'
        },
        {
          id: '2',
          type: 'generation',
          title: 'Offre générée',
          description: 'Formation en ligne sur le marketing digital',
          timestamp: '5 heures',
          icon: 'gift'
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Badge débloqué',
          description: 'Vous avez atteint 7 jours consécutifs !',
          timestamp: '1 jour',
          icon: 'award'
        }
      ]);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setStats({
        totalOpportunities: 12,
        subscriptionPlan: 'Gratuit',
        toolsUsed: 3,
        generationsThisMonth: 15,
        businessScore: 34,
        streakDays: 1,
        totalRevenue: 0
      });
      setAchievements([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.firstName || 
    user?.name?.split(' ')[0] || 
    user?.email?.split('@')[0] || 
    'Entrepreneur';

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </LayoutWithSidebar>
    );
  }

  return (
    <LayoutWithSidebar>
      <PageBentoLayout
        icon={<BarChart3 className="w-6 h-6 text-white" />}
        title={`Bonjour ${userName} !`}
        subtitle="Votre tableau de bord entrepreneurial"
      >
        <div className="space-y-5">
          
          {/* Statistiques principales */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Outils utilisés"
              value={stats?.toolsUsed || 0}
              trend="+2 cette semaine"
              trendUp={true}
              icon={<Bot className="w-7 h-7 text-blue-500" />}
            />
            <StatCard
              label="Générations ce mois"
              value={stats?.generationsThisMonth || 0}
              trend="+15% vs mois dernier"
              trendUp={true}
              icon={<Zap className="w-7 h-7 text-yellow-500" />}
            />
            <StatCard
              label="Score Business"
              value={`${stats?.businessScore || 0}%`}
              trend="+5 points"
              trendUp={true}
              icon={<TrendingUp className="w-7 h-7 text-green-500" />}
            />
            <StatCard
              label="Streak"
              value={`${stats?.streakDays || 0}j`}
              trend="Record personnel !"
              trendUp={true}
              trendColor="text-orange-500"
              icon={<Flame className="w-7 h-7 text-orange-500" />}
            />
          </div>

          {/* Actions rapides */}
          <div className="bg-card rounded-xl p-5 border border-border">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-primary" />
              Actions rapides
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <QuickActionLink href="/outils/icp-maker" icon={<Target className="w-4 h-4 text-primary" />} label="Créer un ICP" iconBg="bg-primary/10 group-hover:bg-primary/20" />
              <QuickActionLink href="/outils/generateur-offre" icon={<Gift className="w-4 h-4 text-blue-500" />} label="Générer une offre" iconBg="bg-blue-500/10 group-hover:bg-blue-500/20" />
              <QuickActionLink href="/outils/lead-magnet" icon={<Users className="w-4 h-4 text-green-500" />} label="Lead Magnet" iconBg="bg-green-500/10 group-hover:bg-green-500/20" />
              <QuickActionLink href="/outils" icon={<Plus className="w-4 h-4 text-muted-foreground" />} label="Tous les outils" iconBg="bg-background-secondary group-hover:bg-border" />
            </div>
          </div>

          {/* Objectifs et achievements */}
          <div className="bg-card rounded-xl p-5 border border-border">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Objectifs et achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-xl border transition-all ${
                  achievement.unlocked 
                    ? 'bg-card border-green-500/30 shadow-sm' 
                    : 'bg-background border-border'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-500/15' : 'bg-background-secondary'
                    }`}>
                      {achievement.icon === 'rocket' && <Rocket className={`w-4 h-4 ${achievement.unlocked ? 'text-green-500' : 'text-muted-foreground'}`} />}
                      {achievement.icon === 'zap' && <Zap className={`w-4 h-4 ${achievement.unlocked ? 'text-green-500' : 'text-muted-foreground'}`} />}
                      {achievement.icon === 'compass' && <Target className={`w-4 h-4 ${achievement.unlocked ? 'text-green-500' : 'text-muted-foreground'}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Progression</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--border)' }}>
                      <div 
                        className={`h-1.5 rounded-full transition-all ${achievement.unlocked ? 'bg-green-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente + Recommandations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Activité récente */}
            <div className="bg-card rounded-xl p-5 border border-border">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Activité récente
              </h3>
              <div className="space-y-2">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/50">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      {activity.icon === 'target' && <Target className="w-3.5 h-3.5 text-primary" />}
                      {activity.icon === 'gift' && <Gift className="w-3.5 h-3.5 text-blue-500" />}
                      {activity.icon === 'award' && <Award className="w-3.5 h-3.5 text-yellow-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                      <p className="text-muted-foreground text-xs truncate">{activity.description}</p>
                      <span className="text-xs text-muted-foreground/60">Il y a {activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommandations */}
            <div className="bg-card rounded-xl p-5 border border-border">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Recommandations pour vous
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                    <h4 className="font-semibold text-foreground text-sm">Prochaine étape suggérée</h4>
                  </div>
                  <p className="text-foreground/70 text-sm mb-2">Créez votre première séquence email avec notre outil Email Wizard</p>
                  <Link href="/outils/email-wizard" className="text-primary text-xs font-medium hover:underline inline-flex items-center gap-1">
                    Commencer maintenant <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                
                <div className="p-4 bg-background rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <h4 className="font-semibold text-foreground text-sm">Formation recommandée</h4>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">Copywriting GPT - Perfectionnez vos textes de vente</p>
                  <Link href="/universite" className="text-blue-500 text-xs font-medium hover:underline inline-flex items-center gap-1">
                    Voir la formation <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Outils populaires */}
          <div className="bg-card rounded-xl p-5 border border-border">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Outils populaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ToolCard href="/outils/icp-maker" icon={<Target className="w-5 h-5 text-primary" />} title="ICP Maker" description="Créez votre client idéal" rating="4.8" uses="1.2k" />
              <ToolCard href="/outils/generateur-offre" icon={<Gift className="w-5 h-5 text-blue-500" />} title="Générateur d'offre" description="Créez des offres irrésistibles" />
              <ToolCard href="/outils/lead-magnet" icon={<Users className="w-5 h-5 text-green-500" />} title="Lead Magnet" description="Attirez vos prospects" />
            </div>
          </div>

          {/* CTA Premium */}
          {!canAccessPremium && (
            <div className="bg-gradient-to-r from-primary/15 to-purple-500/15 rounded-xl p-6 border border-primary/25">
              <div className="text-center">
                <Crown className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-2">Passez à Premium</h3>
                <p className="text-muted-foreground mb-4">Débloquez tous les outils IA et les opportunités business</p>
                <Link href="/premium" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg transition-colors font-semibold">
                  <Crown className="w-4 h-4" />
                  Découvrir Premium
                </Link>
              </div>
            </div>
          )}
        </div>
      </PageBentoLayout>
    </LayoutWithSidebar>
  );
}

// ===== SUB-COMPONENTS =====

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  trendColor?: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, trend, trendUp, trendColor, icon }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {trendUp ? <ArrowUp className={`w-3 h-3 ${trendColor || 'text-green-500'}`} /> : <ArrowDown className="w-3 h-3 text-red-500" />}
        <span className={`text-xs ${trendColor || 'text-green-500'}`}>{trend}</span>
      </div>
    </div>
  );
}

interface QuickActionLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  iconBg: string;
}

function QuickActionLink({ href, icon, label, iconBg }: QuickActionLinkProps) {
  return (
    <Link href={href} className="flex items-center gap-2.5 p-3 bg-background rounded-lg border border-border hover:border-border-hover hover:shadow-sm transition-all group">
      <div className={`p-1.5 rounded-md flex-shrink-0 transition-colors ${iconBg}`}>
        {icon}
      </div>
      <span className="text-foreground font-medium text-sm">{label}</span>
    </Link>
  );
}

interface ToolCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  rating?: string;
  uses?: string;
}

function ToolCard({ href, icon, title, description, rating, uses }: ToolCardProps) {
  return (
    <Link href={href} className="p-4 bg-background rounded-xl border border-border hover:border-border-hover hover:shadow-sm transition-all group block">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-background-secondary group-hover:bg-card transition-colors flex-shrink-0">
          {icon}
        </div>
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      <p className="text-muted-foreground text-xs">{description}</p>
      {rating && (
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3 h-3 text-yellow-500" />
          <span className="text-xs text-muted-foreground">{rating} ({uses} utilisations)</span>
        </div>
      )}
    </Link>
  );
}
