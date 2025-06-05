'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, TrendingUp, Users, Zap, Bot, Target, Search, Plus, Crown, Lock,
  ArrowRight, CheckCircle, Rocket, Trophy, Clock, DollarSign, Mail, Calendar,
  Package, Star, Gift, Lightbulb, ChevronRight, Timer, Brain, Heart, Sparkles,
  Filter, Play, Pause, RotateCcw, Eye, Settings, Bell, Flame
} from 'lucide-react';

// Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import OpportunitiesSection from '@/components/dashboard/OpportunitiesSection';
import PersonalizedSuggestions from '@/components/dashboard/PersonalizedSuggestions';
import AchievementsSection from '@/components/dashboard/AchievementsSection';
import ToolsGrid from '@/components/dashboard/ToolsGrid';
import PremiumCTA from '@/components/dashboard/PremiumCTA';
import OnboardingFlow from '@/components/dashboard/OnboardingFlow';

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

interface Opportunity {
  id: string;
  title: string;
  description: string;
  source: string;
  relevance_score: number;
  priority_level: string;
  status: string;
  tags: string[];
  sector: string;
  created_at: string;
  ai_analysis?: any;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress?: number;
  unlockedAt?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export default function ModernDashboardPage() {
  // States
  const [stats, setStats] = useState<UserStats | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Hooks
  const supabase = createClientComponentClient();
  const { user, canAccessPremium, isAdmin } = useAuth();

  // Effects
  useEffect(() => {
    loadDashboardData();
    checkFirstVisit();
  }, [user]);

  // Data loading functions
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for development - replace with real API calls
      const mockStats: UserStats = {
        totalOpportunities: canAccessPremium ? 47 : 12,
        subscriptionPlan: canAccessPremium ? 'Premium' : 'Gratuit',
        toolsUsed: canAccessPremium ? 12 : 3,
        generationsThisMonth: canAccessPremium ? 247 : 15,
        businessScore: canAccessPremium ? 87 : 34,
        streakDays: 7,
        totalRevenue: canAccessPremium ? 12450 : 0
      };

      const mockOpportunities: Opportunity[] = [
        {
          id: '1',
          title: 'Startup FinTech lève 2M€',
          description: 'Nouvelle opportunité dans le secteur bancaire digital',
          source: 'LinkedIn',
          relevance_score: 92,
          priority_level: 'high',
          status: 'new',
          tags: ['fintech', 'levée de fonds'],
          sector: 'Finance',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Marché SaaS B2B en croissance',
          description: 'Opportunité dans l\'automatisation des processus',
          source: 'TechCrunch',
          relevance_score: 78,
          priority_level: 'medium',
          status: 'analyzed',
          tags: ['saas', 'b2b'],
          sector: 'Tech',
          created_at: new Date().toISOString()
        }
      ];

      const mockAchievements: Achievement[] = [
        {
          id: 'first-tool',
          title: 'Premier Outil',
          description: 'Utilisez votre premier outil IA',
          icon: Bot,
          unlocked: true,
          unlockedAt: '2024-01-15'
        },
        {
          id: 'premium-user',
          title: 'Entrepreneur Premium',
          description: 'Passez au plan Premium',
          icon: Crown,
          unlocked: canAccessPremium,
          unlockedAt: canAccessPremium ? '2024-01-20' : undefined
        },
        {
          id: 'power-user',
          title: 'Power User',
          description: 'Utilisez 5 outils différents',
          icon: Zap,
          unlocked: mockStats.toolsUsed >= 5,
          progress: Math.min(100, (mockStats.toolsUsed / 5) * 100)
        },
        {
          id: 'business-expert',
          title: 'Expert Business',
          description: 'Atteignez un score business de 80+',
          icon: Trophy,
          unlocked: mockStats.businessScore >= 80,
          progress: Math.min(100, (mockStats.businessScore / 80) * 100)
        }
      ];

      setStats(mockStats);
      setOpportunities(mockOpportunities);
      setAchievements(mockAchievements);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFirstVisit = () => {
    const hasVisited = localStorage.getItem('dashboard-visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('dashboard-visited', 'true');
    }
  };

  // Loading state
  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full"
          />
        </div>
      </LayoutWithSidebar>
    );
  }

  return (
    <LayoutWithSidebar>
      <motion.div 
        className="min-h-screen bg-[#0a0a0a] relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff0033]/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff0033]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* 1. Header personnalisé */}
          <motion.div variants={itemVariants}>
            <DashboardHeader user={user} stats={stats} />
          </motion.div>

          {/* 2. Statistiques / Progression */}
          <motion.div variants={itemVariants}>
            <StatsOverview stats={stats} canAccessPremium={canAccessPremium} />
          </motion.div>

          {/* 3. Actions rapides */}
          <motion.div variants={itemVariants}>
            <QuickActions canAccessPremium={canAccessPremium} />
          </motion.div>

          {/* 4. Opportunités Business / Veille */}
          <motion.div variants={itemVariants}>
            <OpportunitiesSection 
              opportunities={opportunities} 
              canAccessPremium={canAccessPremium}
            />
          </motion.div>

          {/* 5. Suggestions IA / To-Do personnalisée */}
          <motion.div variants={itemVariants}>
            <PersonalizedSuggestions 
              canAccessPremium={canAccessPremium}
              stats={stats}
            />
          </motion.div>

          {/* 6. Achievements / Gamification */}
          <motion.div variants={itemVariants}>
            <AchievementsSection achievements={achievements} />
          </motion.div>

          {/* 7. Outils IA (AiToolsGrid) */}
          <motion.div variants={itemVariants}>
            <ToolsGrid canAccessPremium={canAccessPremium} />
          </motion.div>

          {/* 8. Footer CTA (gratuits uniquement) */}
          {!canAccessPremium && (
            <motion.div variants={itemVariants}>
              <PremiumCTA />
            </motion.div>
          )}
        </div>

        {/* Onboarding Flow */}
        <AnimatePresence>
          {showOnboarding && (
            <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutWithSidebar>
  );
}