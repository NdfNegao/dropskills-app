'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { AiToolsGrid } from '@/components/AiToolsGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  Zap, 
  Bot,
  Target,
  Sparkles,
  Search,
  Plus,
  Crown,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Trophy,
  Clock,
  DollarSign,
  Mail,
  Calendar,
  Package,
  Star,
  Gift,
  Lightbulb,
  ChevronRight,
  Timer,
  Brain,
  Heart
} from 'lucide-react';

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
  creative_content?: any;
}

interface UserStats {
  totalOpportunities: number;
  subscriptionPlan: string;
  toolsUsed: number;
  generationsThisMonth: number;
  businessScore: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress?: number;
}

export default function DashboardPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  const supabase = createClientComponentClient();
  const { user, canAccessPremium, isAdmin } = useAuth();

  useEffect(() => {
    loadDashboardData();
    loadAchievements();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Charger les opportunités récentes
      const { data: opportunitiesData } = await supabase
        .from('scraped_opportunities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Charger les informations utilisateur
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('plan_name')
          .eq('user_id', user.user.id)
          .eq('status', 'active')
          .single();

        // Calcul du score business (simulation)
        const businessScore = Math.min(100, 
          (opportunitiesData?.length || 0) * 5 + 
          (subscription ? 40 : 0) + 
          Math.floor(Math.random() * 30)
        );

        setStats({
          totalOpportunities: opportunitiesData?.length || 0,
          subscriptionPlan: subscription?.plan_name || 'Gratuit',
          toolsUsed: canAccessPremium ? 8 : 2,
          generationsThisMonth: canAccessPremium ? 247 : 15,
          businessScore
        });
      }

      setOpportunities(opportunitiesData || []);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAchievements = () => {
    // Achievements système
    const baseAchievements = [
      {
        id: 'first-tool',
        title: 'Premier Outil',
        description: 'Utilisez votre premier outil IA',
        icon: Bot,
        unlocked: true
      },
      {
        id: 'premium-user',
        title: 'Entrepreneur Premium',
        description: 'Passez au plan Premium',
        icon: Crown,
        unlocked: canAccessPremium
      },
      {
        id: 'power-user',
        title: 'Power User',
        description: 'Utilisez 5 outils différents',
        icon: Zap,
        unlocked: canAccessPremium,
        progress: canAccessPremium ? 100 : 40
      },
      {
        id: 'business-expert',
        title: 'Expert Business',
        description: 'Atteignez un score business de 80+',
        icon: Trophy,
        unlocked: (stats?.businessScore || 0) >= 80,
        progress: Math.min(100, ((stats?.businessScore || 0) / 80) * 100)
      }
    ];
    
    setAchievements(baseAchievements);
  };

  const launchVeille = async () => {
    if (!searchKeywords.trim()) return;

    try {
      const response = await fetch('/api/apify/scrape/veille', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: searchKeywords.split(',').map(k => k.trim()),
          sources: ['linkedin', 'news'],
          maxResults: 50,
          dateRange: 'week'
        })
      });

      const result = await response.json();
      if (result.success) {
        setSearchKeywords('');
        loadDashboardData();
        alert('Veille lancée avec succès !');
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur lancement veille:', error);
      alert('Erreur lors du lancement de la veille');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getBusinessScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement de votre dashboard DropSkills...</p>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: "Opportunités",
      value: stats?.totalOpportunities || 0,
      color: "text-blue-400",
      description: "Détectées ce mois"
    },
    {
      icon: <Bot className="w-4 h-4" />,
      label: "Outils Utilisés",
      value: `${stats?.toolsUsed || 0}/15`,
      color: canAccessPremium ? "text-green-400" : "text-orange-400",
      description: canAccessPremium ? "Accès complet" : "Limité"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: "Générations",
      value: stats?.generationsThisMonth || 0,
      color: "text-purple-400",
      description: "Ce mois"
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      label: "Score Business",
      value: `${stats?.businessScore || 0}/100`,
      color: getBusinessScoreColor(stats?.businessScore || 0),
      description: "Votre progression"
    }
  ];

  // Suggestions personnalisées selon le plan
  const getPersonalizedSuggestions = () => {
    if (canAccessPremium) {
      return [
        {
          title: "Optimisez votre ICP",
          description: "Affinez votre client idéal avec l'IA",
          icon: Target,
          action: "/outils/icp-maker",
          type: "optimization"
        },
        {
          title: "Créez votre tunnel de vente",
          description: "Automatisez vos conversions",
          icon: Package,
          action: "/outils/tunnel-maker",
          type: "growth"
        },
        {
          title: "Planifiez 90 jours de contenu",
          description: "Stratégie content marketing complète",
          icon: Calendar,
          action: "/outils/content-system",
          type: "content"
        }
      ];
    } else {
      return [
        {
          title: "Passez Premium pour débloquer",
          description: "15+ outils IA pour entrepreneurs",
          icon: Crown,
          action: "/premium",
          type: "upgrade"
        },
        {
          title: "Testez ICP Maker",
          description: "Gratuit - Définissez votre client idéal",
          icon: Target,
          action: "/outils/icp-maker",
          type: "trial"
        },
        {
          title: "Découvrez nos formations",
          description: "27 formations gratuites disponibles",
          icon: Brain,
          action: "/universite",
          type: "education"
        }
      ];
    }
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{`Bonjour ${
                user?.firstName || 
                user?.name?.split(' ')[0] || 
                user?.email?.split('@')[0] || 
                'Entrepreneur'
              } 👋`}</h1>
              <p className="text-muted-foreground">Votre centre de contrôle DropSkills - Transformez vos idées en business</p>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>{stat.icon}<span className="text-sm font-medium">{stat.label}</span></div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      {/* Alert Premium si utilisateur gratuit */}
      {!canAccessPremium && (
        <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/5 border-l-4 border-[#ff0033] rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#ff0033]/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#ff0033]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  🚀 Débloquez votre potentiel business
                </h3>
                <p className="text-gray-300 mb-3">
                  Vous utilisez seulement <strong>13%</strong> de la puissance DropSkills. 
                  Passez Premium pour accéder aux 15+ outils IA qui transforment les entrepreneurs.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    ICP Maker IA
                  </span>
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Tunnel Builder
                  </span>
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    CopyMoney Mail
                  </span>
                  <span className="text-gray-400">+ 12 autres...</span>
                </div>
              </div>
            </div>
            <Link
              href="/premium"
              className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
            >
              <Crown className="w-5 h-5" />
              Upgrade Premium
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Suggestions Personnalisées */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                🎯 Suggestions pour vous
              </h2>
              <p className="text-sm text-muted-foreground">
                Actions recommandées pour booster votre business
              </p>
            </div>
          </div>
          {canAccessPremium && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold">
              <Crown className="w-3 h-3 mr-1" />
              Premium Active
            </Badge>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {getPersonalizedSuggestions().map((suggestion, index) => (
            <Link
              key={index}
              href={suggestion.action}
              className="group bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[#232323] rounded-xl p-5 hover:border-[#ff0033]/30 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  suggestion.type === 'upgrade' ? 'bg-[#ff0033]/20 text-[#ff0033]' :
                  suggestion.type === 'growth' ? 'bg-green-500/20 text-green-400' :
                  suggestion.type === 'content' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  <suggestion.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white group-hover:text-[#ff0033] transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {suggestion.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff0033] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Achievements & Gamification */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">🏆 Vos Succès</h2>
            <p className="text-sm text-muted-foreground">
              Débloquez des achievements en utilisant DropSkills
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-gradient-to-br from-[#111111] to-[#1a1a1a] border rounded-xl p-4 ${
                achievement.unlocked ? 'border-yellow-500/30' : 'border-[#232323]'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  achievement.unlocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-500'
                }`}>
                  <achievement.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-sm ${
                    achievement.unlocked ? 'text-white' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                </div>
                {achievement.unlocked && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
              <p className={`text-xs ${
                achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {achievement.description}
              </p>
              {achievement.progress !== undefined && (
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{achievement.progress}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interface de veille rapide */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">🔍 Veille Automatisée</h2>
              <p className="text-sm text-muted-foreground">
                Détectez les opportunités business en temps réel
              </p>
            </div>
          </div>
          <Link 
            href="/veille/nouvelle"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Veille
          </Link>
        </div>
        
        <div className="space-y-4">
          {!canAccessPremium && (
            <div className="bg-[#ff0033]/10 border border-[#ff0033]/30 rounded-lg p-3 flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#ff0033]" />
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  <strong>Version limitée :</strong> La veille premium débloque LinkedIn, ProductHunt, Crunchbase et analyses IA avancées.
                </p>
              </div>
              <Link
                href="/premium"
                className="text-[#ff0033] hover:text-[#cc0029] text-sm font-medium"
              >
                Upgrade →
              </Link>
            </div>
          )}
          
          <div className="flex gap-4">
            <Input
              placeholder="Mots-clés séparés par des virgules (ex: startup, fintech, levée de fonds)"
              className="flex-1"
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && launchVeille()}
            />
            <Button
              onClick={launchVeille}
              disabled={!searchKeywords.trim()}
              className="px-6"
            >
              <Search className="w-4 h-4 mr-2" />
              {canAccessPremium ? 'Lancer Veille Pro' : 'Lancer Veille'}
            </Button>
          </div>
        </div>
      </div>

      {/* Outils IA avec limitations visuelles */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">🤖 Outils IA Business</h2>
              <p className="text-sm text-muted-foreground">
                {canAccessPremium 
                  ? "Tous vos outils IA sont débloqués" 
                  : `${stats?.toolsUsed || 2}/15 outils disponibles - Upgrade pour tout débloquer`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!canAccessPremium && (
              <Link
                href="/premium"
                className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-4 py-2 rounded-lg hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 flex items-center gap-2 text-sm font-semibold"
              >
                <Crown className="w-4 h-4" />
                Débloquer Tout
              </Link>
            )}
            <Link 
              href="/outils"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Voir tous les outils
            </Link>
          </div>
        </div>
        
        <AiToolsGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
        
        {!canAccessPremium && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-3">
              <strong>13 outils IA premium</strong> vous attendent pour transformer votre business
            </p>
            <div className="flex justify-center gap-2 text-xs text-gray-500">
              <span>• Tunnel Builder IA</span>
              <span>• CopyMoney Mail</span>
              <span>• Content System 90J</span>
              <span>• Lead Magnet Creator</span>
              <span>+ 9 autres</span>
            </div>
          </div>
        )}
      </div>

      {/* Opportunités Récentes avec insights */}
      {opportunities.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">📊 Opportunités Business</h2>
              <p className="text-sm text-muted-foreground">
                {opportunities.length} opportunités détectées par votre veille IA
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {opportunities.slice(0, 5).map((opportunity) => (
              <div key={opportunity.id} className="border border-border rounded-lg p-4 hover:border-[#ff0033]/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-foreground">{opportunity.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${getPriorityColor(opportunity.priority_level)} text-white`}
                    >
                      {opportunity.priority_level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Score: {opportunity.relevance_score}%
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Source: {opportunity.source}</span>
                  <span>{new Date(opportunity.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
          
          {opportunities.length > 5 && (
            <div className="mt-6 text-center">
              <Link 
                href="/dashboard/opportunities"
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center justify-center gap-2"
              >
                Voir toutes les opportunités ({opportunities.length})
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions Premium */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/outils/icp-maker"
          className="group bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:border-[#ff0033]/30 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#ff0033] transition-colors">
                ICP Maker IA
              </h3>
              <p className="text-sm text-gray-400">
                Définissez votre client idéal
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              ✓ Inclus Gratuit
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff0033] transition-colors" />
          </div>
        </Link>

        <Link
          href={canAccessPremium ? "/outils/tunnel-maker" : "/premium"}
          className="group bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:border-[#ff0033]/30 transition-all duration-200 transform hover:scale-[1.02] relative"
        >
          {!canAccessPremium && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-8 h-8 text-[#ff0033] mx-auto mb-2" />
                <span className="text-sm font-medium text-white">Premium Requis</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#ff0033] transition-colors">
                Tunnel Builder IA
              </h3>
              <p className="text-sm text-gray-400">
                Créez vos tunnels de vente
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              canAccessPremium 
                ? 'text-yellow-400 bg-yellow-400/10' 
                : 'text-[#ff0033] bg-[#ff0033]/10'
            }`}>
              {canAccessPremium ? '✓ Premium' : '🔒 Premium'}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff0033] transition-colors" />
          </div>
        </Link>

        <Link
          href={canAccessPremium ? "/outils/copymoneymail" : "/premium"}
          className="group bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:border-[#ff0033]/30 transition-all duration-200 transform hover:scale-[1.02] relative"
        >
          {!canAccessPremium && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-8 h-8 text-[#ff0033] mx-auto mb-2" />
                <span className="text-sm font-medium text-white">Premium Requis</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#ff0033] transition-colors">
                CopyMoney Mail
              </h3>
              <p className="text-sm text-gray-400">
                Emails qui convertissent
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              canAccessPremium 
                ? 'text-yellow-400 bg-yellow-400/10' 
                : 'text-[#ff0033] bg-[#ff0033]/10'
            }`}>
              {canAccessPremium ? '✓ Premium' : '🔒 Premium'}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff0033] transition-colors" />
          </div>
        </Link>
      </div>

      {/* Footer CTA pour utilisateurs gratuits */}
      {!canAccessPremium && (
        <div className="mt-12 bg-gradient-to-r from-[#ff0033]/10 via-[#cc0029]/5 to-[#ff0033]/10 border border-[#ff0033]/20 rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Prêt à transformer votre business ?
            </h3>
            <p className="text-gray-300 mb-6">
              Rejoignez <strong>2,847 entrepreneurs</strong> qui utilisent DropSkills Premium pour automatiser leur croissance et générer plus de revenus.
            </p>
            <div className="flex items-center justify-center gap-8 mb-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff0033]">15+</div>
                <div className="text-gray-400">Outils IA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff0033]">∞</div>
                <div className="text-gray-400">Générations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff0033]">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/premium"
                className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Passer Premium
                <Star className="w-4 h-4" />
              </Link>
              <Link
                href="/universite"
                className="border border-[#ff0033] text-[#ff0033] px-8 py-4 rounded-lg font-semibold hover:bg-[#ff0033]/10 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Formations Gratuites
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Garantie satisfait ou remboursé 30 jours • Annulation possible à tout moment
            </p>
          </div>
        </div>
      )}
      </div>
    </LayoutWithSidebar>
  );
}