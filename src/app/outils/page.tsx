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
  CalendarCheck,
  Search,
  FileText,
  Calculator,
  PenTool,
  Lightbulb,
  ArrowDown,
  BookOpen,
  Eye
} from 'lucide-react';

// Flow logique selon l'ordre stratégique de l'utilisateur
const AI_TOOLS_FLOW = [
  {
    id: 1,
    name: "ICP Maker",
    description: "Créez votre client idéal en quelques clics",
    icon: <Target className="w-6 h-6" />,
    type: "Stratégie",
    href: "/outils/icp-maker",
    color: "from-blue-500 to-purple-600",
    isPremium: true,
    step: 1,
    stepTitle: "CIBLE",
    stepDescription: "Définir qui vous servez"
  },
  {
    id: 2,
    name: "USP Maker",
    description: "Créez votre proposition de valeur unique",
    icon: <Rocket className="w-6 h-6" />,
    type: "Positionnement",
    href: "/outils/usp-maker",
    color: "from-purple-500 to-pink-600",
    isPremium: true,
    step: 2,
    stepTitle: "OFFRE",
    stepDescription: "Définir ce que vous vendez"
  },
  {
    id: 3,
    name: "Générateur d'Offre",
    description: "Générez des offres irrésistibles automatiquement",
    icon: <Sparkles className="w-6 h-6" />,
    type: "Vente",
    href: "/outils/generateur-offre",
    color: "from-green-500 to-emerald-600",
    isPremium: true,
    step: 2,
    stepTitle: "OFFRE",
    stepDescription: "Structurer votre proposition"
  },
  {
    id: 4,
    name: "Tunnel Maker IA",
    description: "Créez des tunnels de vente optimisés",
    icon: <FolderKanban className="w-6 h-6" />,
    type: "Conversion",
    href: "/outils/tunnel-maker",
    color: "from-orange-500 to-red-600",
    isPremium: true,
    step: 3,
    stepTitle: "CONVERSION",
    stepDescription: "Automatiser vos ventes"
  },
  {
    id: 5,
    name: "CopyMoneyMail",
    description: "Rédigez des emails qui convertissent",
    icon: <Mail className="w-6 h-6" />,
    type: "Activation",
    href: "/outils/copymoneymail",
    color: "from-pink-500 to-rose-600",
    isPremium: true,
    step: 4,
    stepTitle: "ACTIVATION",
    stepDescription: "Engager et convertir"
  },
  {
    id: 6,
    name: "Lead Magnet Creator",
    description: "Créez des aimants à prospects irrésistibles",
    icon: <Users className="w-6 h-6" />,
    type: "Activation",
    href: "/outils/lead-magnet",
    color: "from-cyan-500 to-blue-600",
    isPremium: true,
    step: 4,
    stepTitle: "ACTIVATION",
    stepDescription: "Capturer des prospects"
  },
  {
    id: 7,
    name: "Content System 90J",
    description: "Planifiez 90 jours de contenu en 10 minutes",
    icon: <CalendarCheck className="w-6 h-6" />,
    type: "Trafic",
    href: "/outils/content-system",
    color: "from-indigo-500 to-blue-600",
    isPremium: true,
    step: 5,
    stepTitle: "TRAFIC",
    stepDescription: "Générer de l'audience"
  },
  {
    id: 8,
    name: "Générateur de Titres",
    description: "Créez des titres accrocheurs pour vos contenus",
    icon: <PenTool className="w-6 h-6" />,
    type: "Contenu",
    href: "/outils/titres",
    color: "from-teal-500 to-cyan-600",
    isPremium: false,
    step: 5,
    stepTitle: "TRAFIC",
    stepDescription: "Optimiser vos contenus"
  },
  {
    id: 9,
    name: "Générateur de Descriptions",
    description: "Rédigez des descriptions qui convertissent",
    icon: <FileText className="w-6 h-6" />,
    type: "Contenu",
    href: "/outils/descriptions",
    color: "from-emerald-500 to-teal-600",
    isPremium: false,
    step: 5,
    stepTitle: "TRAFIC",
    stepDescription: "Perfectionner vos textes"
  },
  {
    id: 10,
    name: "PDF Rebrander",
    description: "Personnalisez vos PDFs automatiquement",
    icon: <BookOpen className="w-6 h-6" />,
    type: "Automatisation",
    href: "/outils/pdf-rebrander",
    color: "from-violet-500 to-purple-600",
    isPremium: true,
    step: 6,
    stepTitle: "AUTOMATISATION",
    stepDescription: "Optimiser vos processus"
  },
  {
    id: 11,
    name: "Calculateur ROI",
    description: "Calculez la rentabilité de vos investissements",
    icon: <Calculator className="w-6 h-6" />,
    type: "Automatisation",
    href: "/outils/calculateur",
    color: "from-amber-500 to-orange-600",
    isPremium: true,
    step: 6,
    stepTitle: "AUTOMATISATION",
    stepDescription: "Mesurer vos performances"
  },
  {
    id: 12,
    name: "Agent Veille IA",
    description: "Surveillez votre marché et vos concurrents",
    icon: <Eye className="w-6 h-6" />,
    type: "Croissance",
    href: "/outils/agent-veille",
    color: "from-red-500 to-pink-600",
    isPremium: true,
    step: 7,
    stepTitle: "CROISSANCE",
    stepDescription: "Maintenir votre avantage"
  }
];

// Grouper les outils par étape
const TOOLS_BY_STEP = AI_TOOLS_FLOW.reduce((acc, tool) => {
  if (!acc[tool.step]) {
    acc[tool.step] = [];
  }
  acc[tool.step].push(tool);
  return acc;
}, {} as Record<number, typeof AI_TOOLS_FLOW>);

const FLOW_STEPS = [
  {
    step: 1,
    title: "CIBLE",
    description: "Définir qui vous servez",
    color: "from-blue-500 to-purple-600",
    explanation: "Avant tout, vous devez savoir exactement qui est votre client idéal. Sans cible précise, tous vos efforts marketing seront dilués."
  },
  {
    step: 2,
    title: "OFFRE",
    description: "Définir ce que vous vendez",
    color: "from-purple-500 to-pink-600",
    explanation: "Une fois votre cible définie, créez une offre irrésistible qui résout parfaitement leurs problèmes spécifiques."
  },
  {
    step: 3,
    title: "CONVERSION",
    description: "Automatiser vos ventes",
    color: "from-orange-500 to-red-600",
    explanation: "Construisez un tunnel de vente qui guide vos prospects vers l'achat de manière automatisée et optimisée."
  },
  {
    step: 4,
    title: "ACTIVATION",
    description: "Engager et convertir",
    color: "from-pink-500 to-rose-600",
    explanation: "Créez des séquences d'emails et des aimants à prospects pour capturer et nurturing votre audience."
  },
  {
    step: 5,
    title: "TRAFIC",
    description: "Générer de l'audience",
    color: "from-indigo-500 to-blue-600",
    explanation: "Développez une stratégie de contenu systématique pour attirer continuellement de nouveaux prospects qualifiés."
  },
  {
    step: 6,
    title: "AUTOMATISATION",
    description: "Optimiser vos processus",
    color: "from-violet-500 to-purple-600",
    explanation: "Automatisez vos processus et mesurez vos performances pour scaler sans vous épuiser."
  },
  {
    step: 7,
    title: "CROISSANCE",
    description: "Maintenir votre avantage",
    color: "from-red-500 to-pink-600",
    explanation: "Surveillez votre marché et vos concurrents pour identifier de nouvelles opportunités et garder votre edge."
  }
];

export default function OutilsPage() {
  const { canAccessPremium } = useAuth();

  const stats = {
    totalTools: AI_TOOLS_FLOW.length,
    premiumTools: AI_TOOLS_FLOW.filter(tool => tool.isPremium).length,
    freeTools: AI_TOOLS_FLOW.filter(tool => !tool.isPremium).length,
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
              <p className="text-gray-400">12 outils d'intelligence artificielle pour construire votre business étape par étape</p>
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
        </div>

        {/* Section Conseil - Flow Stratégique */}
        <div className="mb-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-400 mb-2">🎯 Flow Stratégique DropSkills</h2>
              <p className="text-blue-300 text-lg">
                Nos outils suivent une logique entrepreneuriale précise : <strong>Acquisition → Conversion → Rétention → Croissance</strong>
              </p>
            </div>
          </div>
          
          <div className="bg-blue-900/10 rounded-lg p-6 border border-blue-500/20">
            <h3 className="text-blue-200 font-semibold mb-4">Pourquoi cet ordre est crucial :</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-300 text-sm">
              <div>
                <h4 className="font-medium mb-3 text-blue-200">🎯 La logique du flow</h4>
                <ul className="space-y-2">
                  <li>• <strong>Si vous ciblez mal</strong> → le tunnel ne sert à rien</li>
                  <li>• <strong>Si votre offre est floue</strong> → personne n'achète</li>
                  <li>• <strong>Si vous n'automatisez pas</strong> → vous vous épuisez</li>
                  <li>• <strong>Si vous ne faites pas de veille</strong> → vous perdez votre edge</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-blue-200">⚡ L'effet démultiplicateur</h4>
                <ul className="space-y-2">
                  <li>• <strong>Chaque étape</strong> démultiplie l'efficacité de la précédente</li>
                  <li>• <strong>Un ICP précis</strong> rend votre tunnel 10x plus performant</li>
                  <li>• <strong>Une offre claire</strong> multiplie vos conversions</li>
                  <li>• <strong>L'automatisation</strong> vous libère pour scaler</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Flow visuel des étapes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Votre Parcours Entrepreneurial</h2>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            {FLOW_STEPS.map((flowStep, index) => (
              <div key={flowStep.step} className="flex items-center">
                <div className={`bg-gradient-to-r ${flowStep.color} rounded-lg p-4 text-center min-w-[140px]`}>
                  <div className="text-white font-bold text-sm">{flowStep.step}. {flowStep.title}</div>
                  <div className="text-white/80 text-xs mt-1">{flowStep.description}</div>
                </div>
                {index < FLOW_STEPS.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Outils organisés par étape */}
        <div className="space-y-12">
          {FLOW_STEPS.map((flowStep) => {
            const stepTools = TOOLS_BY_STEP[flowStep.step] || [];
            if (stepTools.length === 0) return null;

            return (
              <div key={flowStep.step} className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`bg-gradient-to-r ${flowStep.color} rounded-lg p-3 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{flowStep.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{flowStep.title}</h3>
                    <p className="text-gray-400">{flowStep.explanation}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stepTools.map((tool) => (
                    <ToolCard 
                      key={tool.id} 
                      tool={tool} 
                      isPremium={canAccessPremium}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Premium */}
        {!canAccessPremium && (
          <div className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-8 text-center mt-12">
            <Crown className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Débloquez le Flow Complet
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Accédez à tous les outils premium et suivez le parcours entrepreneurial complet pour transformer votre business.
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
                className="bg-black/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-black/30 transition-colors border border-white/30"
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
  tool: typeof AI_TOOLS_FLOW[0];
  isPremium: boolean;
}

function ToolCard({ tool, isPremium }: ToolCardProps) {
  const canAccess = !tool.isPremium || isPremium;

  return (
    <div className={`bg-[#111111] border border-[#232323] rounded-xl p-6 hover:border-[#333] transition-all duration-200 ${!canAccess ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center`}>
          {tool.icon}
        </div>
        <div className="flex gap-2">
          {tool.isPremium ? (
            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium border border-yellow-500/30">
              👑 PREMIUM
            </span>
          ) : (
            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium border border-green-500/30">
              🆓 GRATUIT
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-white font-semibold text-lg mb-2">{tool.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded">
          {tool.type}
        </span>
        
        {canAccess ? (
          <a
            href={tool.href}
            className="bg-[#ff0033] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#cc0029] transition-colors inline-flex items-center gap-2"
          >
            Utiliser
            <ArrowRight className="w-3 h-3" />
          </a>
        ) : (
          <button className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed inline-flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Premium
          </button>
        )}
      </div>
    </div>
  );
} 