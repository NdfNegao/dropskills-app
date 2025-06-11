'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import PageBentoLayout from '@/components/PageBentoLayout';
import { useAuth } from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
import { 
  BarChart3, TrendingUp, Users, Zap, Bot, Target, Plus, Crown, Lock,
  CheckCircle, Rocket, Trophy, Clock, DollarSign, Package, Star, Gift, 
  Lightbulb, ChevronRight, Brain, Heart, Settings, Bell, Calendar,
  Award, Activity, BookOpen, Flame, ArrowUp, ArrowDown, Minus
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
  // States
  const [stats, setStats] = useState<UserStats | null>(null);

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Hooks
  const supabase = createClientComponentClient();
  const { user, canAccessPremium, isAdmin } = useAuth();

  // Effects
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Data loading functions
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Charger les vraies statistiques
      const statsResponse = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        console.error('Erreur API stats:', statsResponse.statusText);
        // Fallback avec données par défaut
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

      // 2. Données simulées pour les nouvelles sections

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
      // Fallback complet
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

  // Loading state
  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
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
        <div className="space-y-6">
          
          {/* Statistiques principales enrichies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Outils utilisés</p>
                  <p className="text-2xl font-bold text-white">{stats?.toolsUsed || 0}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+2 cette semaine</span>
                  </div>
                </div>
                <Bot className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Générations ce mois</p>
                  <p className="text-2xl font-bold text-white">{stats?.generationsThisMonth || 0}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+15% vs mois dernier</span>
                  </div>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Score Business</p>
                  <p className="text-2xl font-bold text-white">{stats?.businessScore || 0}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+5 points</span>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Streak</p>
                  <p className="text-2xl font-bold text-white">{stats?.streakDays || 0} jours</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-orange-500">Record personnel !</span>
                  </div>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>



          {/* Actions rapides */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#ff0033]" />
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/outils/icp-maker" className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                <Target className="w-5 h-5 text-[#ff0033]" />
                <span className="text-white">Créer un ICP</span>
              </Link>
              
              <Link href="/outils/generateur-offre" className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                <Gift className="w-5 h-5 text-blue-500" />
                <span className="text-white">Générer une offre</span>
              </Link>
              
              <Link href="/outils/lead-magnet" className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                <Users className="w-5 h-5 text-green-500" />
                <span className="text-white">Lead Magnet</span>
              </Link>
              
              <Link href="/outils" className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                <Plus className="w-5 h-5 text-gray-400" />
                <span className="text-white">Voir tous les outils</span>
              </Link>
            </div>
          </div>

          {/* Objectifs et achievements */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#ff0033]" />
              Objectifs et achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-[#1a1a1a] border-green-500/30' 
                    : 'bg-[#0f0f0f] border-[#232323]'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-500/20' : 'bg-gray-500/20'
                    }`}>
                      {achievement.icon === 'rocket' && <Rocket className={`w-4 h-4 ${
                        achievement.unlocked ? 'text-green-500' : 'text-gray-500'
                      }`} />}
                      {achievement.icon === 'zap' && <Zap className={`w-4 h-4 ${
                        achievement.unlocked ? 'text-green-500' : 'text-gray-500'
                      }`} />}
                      {achievement.icon === 'compass' && <Target className={`w-4 h-4 ${
                        achievement.unlocked ? 'text-green-500' : 'text-gray-500'
                      }`} />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.unlocked ? 'text-white' : 'text-gray-400'
                      }`}>{achievement.title}</h4>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progression</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-[#232323] rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-[#ff0033]'
                        }`}
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente et recommandations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activité récente */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#ff0033]" />
                Activité récente
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="p-2 bg-[#ff0033]/20 rounded-lg">
                      {activity.icon === 'target' && <Target className="w-4 h-4 text-[#ff0033]" />}
                      {activity.icon === 'gift' && <Gift className="w-4 h-4 text-blue-500" />}
                      {activity.icon === 'award' && <Award className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{activity.title}</h4>
                      <p className="text-gray-400 text-xs">{activity.description}</p>
                      <span className="text-xs text-gray-500">Il y a {activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommandations personnalisées */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#ff0033]" />
                Recommandations pour vous
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-[#ff0033]/10 to-blue-500/10 rounded-lg border border-[#ff0033]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-[#ff0033]" />
                    <h4 className="font-medium text-white text-sm">Prochaine étape suggérée</h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">Créez votre première séquence email avec notre outil Email Wizard</p>
                  <Link href="/outils/email-wizard" className="text-[#ff0033] text-xs hover:underline">
                    Commencer maintenant →
                  </Link>
                </div>
                
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <h4 className="font-medium text-white text-sm">Formation recommandée</h4>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Copywriting GPT - Perfectionnez vos textes de vente</p>
                  <Link href="/universite" className="text-blue-500 text-xs hover:underline">
                    Voir la formation →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Outils populaires */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#ff0033]" />
              Outils populaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/outils/icp-maker" className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-[#ff0033]" />
                  <h4 className="font-medium text-white">ICP Maker</h4>
                </div>
                <p className="text-gray-400 text-sm">Créez votre client idéal</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-500">4.8 (1.2k utilisations)</span>
                </div>
              </Link>
              
              <Link href="/outils/generateur-offre" className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-6 h-6 text-blue-500" />
                  <h4 className="font-medium text-white">Générateur d'offre</h4>
                </div>
                <p className="text-gray-400 text-sm">Créez des offres irrésistibles</p>
              </Link>
              
              <Link href="/outils/lead-magnet" className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-green-500" />
                  <h4 className="font-medium text-white">Lead Magnet</h4>
                </div>
                <p className="text-gray-400 text-sm">Attirez vos prospects</p>
              </Link>
            </div>
          </div>

          {/* CTA Premium pour les utilisateurs gratuits */}
          {!canAccessPremium && (
            <div className="bg-gradient-to-r from-[#ff0033]/20 to-purple-500/20 rounded-xl p-6 border border-[#ff0033]/30">
              <div className="text-center">
                <Crown className="w-12 h-12 text-[#ff0033] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Passez à Premium</h3>
                <p className="text-gray-300 mb-4">Débloquez tous les outils IA et les opportunités business</p>
                <Link href="/premium" className="inline-flex items-center gap-2 bg-[#ff0033] text-white px-6 py-3 rounded-lg hover:bg-[#ff0033]/90 transition-colors">
                  <Crown className="w-5 h-5" />
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