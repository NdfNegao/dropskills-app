'use client';

import React from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useAuth } from '@/hooks/useAuth';
import { 
  Lock, 
  Crown, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Users,
  Target,
  ArrowRight,
  CheckCircle,
  BrainCog,
  Rocket,
  FolderKanban,
  Mail,
  CalendarCheck
} from 'lucide-react';

const AI_TOOLS = [
  {
    id: 1,
    name: "ICP Maker",
    description: "Créez votre client idéal en quelques clics",
    icon: <BrainCog className="w-6 h-6" />,
    type: "Stratégie",
    href: "/outils/icp-maker",
    color: "from-blue-500 to-purple-600",
    isPremium: true
  },
  {
    id: 2,
    name: "Générateur d'Offre",
    description: "Générez des offres irrésistibles automatiquement",
    icon: <Rocket className="w-6 h-6" />,
    type: "Vente",
    href: "/outils/generateur-offre",
    color: "from-green-500 to-emerald-600",
    isPremium: true
  },
  {
    id: 3,
    name: "Tunnel de Vente IA",
    description: "Créez des tunnels de vente optimisés",
    icon: <FolderKanban className="w-6 h-6" />,
    type: "Marketing",
    href: "/outils/tunnel-maker",
    color: "from-orange-500 to-red-600",
    isPremium: true
  },
  {
    id: 4,
    name: "CopyMoneyMail",
    description: "Rédigez des emails qui convertissent",
    icon: <Mail className="w-6 h-6" />,
    type: "Email",
    href: "/outils/copymoneymail",
    color: "from-pink-500 to-rose-600",
    isPremium: true
  },
  {
    id: 5,
    name: "Content System 90J",
    description: "Planifiez 90 jours de contenu en 10 minutes",
    icon: <CalendarCheck className="w-6 h-6" />,
    type: "Contenu",
    href: "/outils/content-system",
    color: "from-indigo-500 to-blue-600",
    isPremium: true
  },
  {
    id: 6,
    name: "Générateur de Titres",
    description: "Créez des titres accrocheurs pour vos contenus",
    icon: <Target className="w-6 h-6" />,
    type: "Contenu",
    href: "/outils/generateur-titres",
    color: "from-teal-500 to-cyan-600",
    isPremium: false
  }
];

export default function OutilsPage() {
  const { canAccessPremium } = useAuth();
  const userPacksCount = 3;

  const stats = {
    totalTools: AI_TOOLS.length,
    premiumTools: AI_TOOLS.filter(tool => tool.isPremium).length,
    freeTools: AI_TOOLS.filter(tool => !tool.isPremium).length,
    totalGenerations: 12847
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Outils IA Dropskills</h1>
              <p className="text-gray-400">6 outils d'intelligence artificielle pour booster votre business en ligne</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Outils</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalTools}</div>
              <div className="text-xs text-gray-400">outils disponibles</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Premium</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.premiumTools}</div>
              <div className="text-xs text-gray-400">outils premium</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Gratuits</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.freeTools}</div>
              <div className="text-xs text-gray-400">accès libre</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Générations</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalGenerations.toLocaleString()}</div>
              <div className="text-xs text-gray-400">créations IA</div>
            </div>
          </div>
          
          {!canAccessPremium && (
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <Crown className="w-5 h-5" />
                    <span className="font-semibold text-lg">Accès Premium Requis</span>
                  </div>
                  <p className="text-yellow-300 mb-4">
                    Débloquez tous les outils IA avec un abonnement premium et transformez votre business dès aujourd'hui.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="/premium"
                      className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
                    >
                      Voir les plans
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      href="/checkout?plan=premium-yearly"
                      className="bg-black/20 text-yellow-300 px-6 py-3 rounded-lg font-semibold hover:bg-black/30 transition-colors border border-yellow-500/30"
                    >
                      Essai gratuit 7 jours
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grille des outils */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {AI_TOOLS.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              isPremium={canAccessPremium}
            />
          ))}
        </div>

        {/* CTA Premium */}
        {!canAccessPremium && (
          <div className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-8 text-center">
            <Crown className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Débloquez Tous les Outils IA
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Accédez aux 6 outils IA premium et boostez votre productivité. Créez du contenu professionnel en quelques clics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/premium"
                className="bg-white text-[#ff0033] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                Voir les plans
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/checkout?plan=premium-yearly"
                className="bg-black/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-black/30 transition-colors border border-white/20"
              >
                Essai gratuit 7 jours
              </a>
            </div>
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  );
}

interface ToolCardProps {
  tool: typeof AI_TOOLS[0];
  isPremium: boolean;
}

function ToolCard({ tool, isPremium }: ToolCardProps) {
  const isLocked = !isPremium;

  return (
    <div className={`relative bg-[#18181b] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all ${isLocked ? 'opacity-60' : 'hover:scale-105'}`}>
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-yellow-500" />
        </div>
      )}

      {/* Icon avec gradient */}
      <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-white mb-4`}>
        {tool.icon}
      </div>

      {/* Contenu */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {tool.name}
      </h3>
      
      <p className="text-gray-300 mb-4">
        {tool.description}
      </p>

      {/* Type badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
          {tool.type}
        </span>
        
        {isLocked ? (
          <button className="text-[#ff0033] text-sm font-medium cursor-not-allowed">
            Premium requis
          </button>
        ) : (
          <a 
            href={tool.href}
            className="text-[#ff0033] text-sm font-medium hover:underline"
          >
            Utiliser →
          </a>
        )}
      </div>
    </div>
  );
} 