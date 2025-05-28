'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useAuth } from '@/hooks/useAuth';
import { 
  Zap, 
  Crown, 
  Search, 
  Filter,
  Star,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Lock,
  Check,
  Wand2,
  Brain,
  Target,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  icon: React.ReactNode;
  features: string[];
  usageCount: number;
  rating: number;
  estimatedTime: string;
  href: string;
  color: string;
}

const TOOLS: Tool[] = [
  {
    id: 'generateur-offre',
    name: 'Générateur d\'Offre IA',
    description: 'Créez des offres commerciales irrésistibles qui convertissent vos prospects en clients.',
    category: 'Marketing',
    isPremium: true,
    isPopular: true,
    icon: <Target className="w-6 h-6" />,
    features: ['8 secteurs d\'activité', 'Templates optimisés', 'Export PDF/Word', 'Conseils d\'optimisation'],
    usageCount: 12847,
    rating: 4.9,
    estimatedTime: '2-3 min',
    href: '/outils/generateur-offre',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'generateur-titres',
    name: 'Générateur de Titres IA',
    description: 'Générez des titres accrocheurs pour toutes vos plateformes et augmentez votre engagement.',
    category: 'Contenu',
    isPremium: true,
    isPopular: true,
    icon: <FileText className="w-6 h-6" />,
    features: ['8 plateformes', '6 tons différents', '10 titres par génération', 'Optimisation SEO'],
    usageCount: 45231,
    rating: 4.8,
    estimatedTime: '1-2 min',
    href: '/outils/generateur-titres',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'content-system',
    name: 'Content System IA',
    description: 'Planifiez 4 semaines de contenu optimisé pour toutes vos plateformes en quelques clics.',
    category: 'Planification',
    isPremium: true,
    isNew: true,
    icon: <Brain className="w-6 h-6" />,
    features: ['Planification 4 semaines', 'Multi-plateformes', 'Calendrier éditorial', 'Export complet'],
    usageCount: 2847,
    rating: 4.7,
    estimatedTime: '3-5 min',
    href: '/outils/content-system',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'icp-maker',
    name: 'ICP Maker',
    description: 'Définissez votre client idéal avec précision grâce à notre outil d\'analyse comportementale.',
    category: 'Stratégie',
    isPremium: true,
    icon: <Users className="w-6 h-6" />,
    features: ['Analyse comportementale', 'Personas détaillés', 'Insights marketing', 'Export professionnel'],
    usageCount: 8934,
    rating: 4.6,
    estimatedTime: '5-7 min',
    href: '/outils/icp-maker',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'tunnel-vente-ia',
    name: 'Tunnel de Vente IA',
    description: 'Construisez des tunnels de conversion optimisés qui transforment vos visiteurs en clients.',
    category: 'Conversion',
    isPremium: true,
    icon: <TrendingUp className="w-6 h-6" />,
    features: ['Templates de tunnels', 'Optimisation conversion', 'A/B testing', 'Analytics intégrés'],
    usageCount: 6742,
    rating: 4.8,
    estimatedTime: '10-15 min',
    href: '/outils/tunnel-vente-ia',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'assistant-copywriting',
    name: 'Assistant Copywriting',
    description: 'Rédigez des textes de vente persuasifs avec l\'aide de notre IA spécialisée en copywriting.',
    category: 'Rédaction',
    isPremium: true,
    icon: <MessageSquare className="w-6 h-6" />,
    features: ['Templates de copy', 'Formules AIDA/PAS', 'Optimisation émotionnelle', 'Multi-formats'],
    usageCount: 15623,
    rating: 4.7,
    estimatedTime: '3-5 min',
    href: '/outils/assistant-copywriting',
    color: 'from-pink-500 to-pink-600'
  }
];

const CATEGORIES = ['Tous', 'Marketing', 'Contenu', 'Planification', 'Stratégie', 'Conversion', 'Rédaction'];

export default function CataloguePage() {
  const { canAccessPremium } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || tool.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || tool.isPremium;
    
    return matchesSearch && matchesCategory && matchesPremium;
  });

  const stats = {
    totalTools: TOOLS.length,
    premiumTools: TOOLS.filter(t => t.isPremium).length,
    totalUsage: TOOLS.reduce((sum, tool) => sum + tool.usageCount, 0),
    avgRating: (TOOLS.reduce((sum, tool) => sum + tool.rating, 0) / TOOLS.length).toFixed(1)
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Catalogue des Outils</h1>
              <p className="text-gray-400">Découvrez tous nos outils IA pour booster votre business</p>
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
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Utilisations</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalUsage.toLocaleString()}</div>
              <div className="text-xs text-gray-400">générations totales</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Satisfaction</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.avgRating}/5</div>
              <div className="text-xs text-gray-400">note moyenne</div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un outil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff0033]"
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <label className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="w-4 h-4 text-[#ff0033] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#ff0033]"
                />
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-sm">Premium uniquement</span>
              </label>
            </div>
          </div>
        </div>

        {/* Outils populaires */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Outils populaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.filter(tool => tool.isPopular).map(tool => (
              <ToolCard key={tool.id} tool={tool} canAccessPremium={canAccessPremium} featured />
            ))}
          </div>
        </div>

        {/* Tous les outils */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Tous les outils ({filteredTools.length})
            </h2>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} canAccessPremium={canAccessPremium} />
              ))}
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-12 text-center">
              <Wand2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Aucun outil trouvé</p>
              <p className="text-gray-500 text-sm">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          )}
        </div>

        {/* CTA Premium */}
        {!canAccessPremium && (
          <div className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-8 text-center">
            <Crown className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Débloquez tous les outils IA
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Accédez à l'ensemble de notre catalogue d'outils IA premium et transformez votre business dès aujourd'hui.
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
  tool: Tool;
  canAccessPremium: boolean;
  featured?: boolean;
}

function ToolCard({ tool, canAccessPremium, featured = false }: ToolCardProps) {
  const isAccessible = !tool.isPremium || canAccessPremium;

  return (
    <div className={`bg-[#111111] border border-[#232323] rounded-xl overflow-hidden hover:border-[#ff0033]/30 transition-all duration-200 ${featured ? 'ring-2 ring-[#ff0033]/20' : ''}`}>
      {/* Header */}
      <div className={`relative h-32 bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white">
          {tool.icon}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {tool.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Nouveau
            </span>
          )}
          {tool.isPopular && (
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium">
              Populaire
            </span>
          )}
        </div>

        {tool.isPremium && (
          <div className="absolute top-3 right-3">
            <Crown className="w-5 h-5 text-yellow-400" />
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Titre et catégorie */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold mb-1">{tool.name}</h3>
            <span className="text-gray-400 text-sm">{tool.category}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs">{tool.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tool.description}</p>

        {/* Fonctionnalités */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {tool.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="bg-[#1a1a1a] text-gray-300 px-2 py-1 rounded text-xs">
                {feature}
              </span>
            ))}
            {tool.features.length > 2 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{tool.features.length - 2} autres
              </span>
            )}
          </div>
        </div>

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {tool.estimatedTime}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {tool.usageCount.toLocaleString()}
          </div>
        </div>

        {/* Bouton d'action */}
        {isAccessible ? (
          <a
            href={tool.href}
            className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-medium hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2"
          >
            Utiliser l'outil
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <div className="space-y-2">
            <button
              disabled
              className="w-full bg-gray-600 text-gray-300 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Premium requis
            </button>
            <a
              href="/premium"
              className="w-full bg-[#ff0033]/10 text-[#ff0033] py-2 rounded-lg text-sm font-medium hover:bg-[#ff0033]/20 transition-colors flex items-center justify-center gap-2 border border-[#ff0033]/30"
            >
              Débloquer
              <Crown className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 