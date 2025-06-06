'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Lock, Star, Zap, MessageSquare, Image, FileText, BarChart, Brain, Palette } from 'lucide-react';
import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'ai' | 'business' | 'design' | 'writing' | 'analytics';
  isPremium: boolean;
  rating: number;
  usage: number; // times used this month
  isNew?: boolean;
  isTrending?: boolean;
}

const tools: Tool[] = [
  {
    id: '1',
    name: 'Générateur de Stratégie',
    description: 'Créez des stratégies business personnalisées en quelques minutes',
    icon: Brain,
    category: 'business',
    isPremium: false,
    rating: 4.8,
    usage: 23,
    isTrending: true
  },
  {
    id: '2',
    name: 'Chat IA Expert',
    description: 'Assistant IA spécialisé dans le business et l\'entrepreneuriat',
    icon: MessageSquare,
    category: 'ai',
    isPremium: true,
    rating: 4.9,
    usage: 0,
    isNew: true
  },
  {
    id: '3',
    name: 'Générateur de Logo',
    description: 'Créez des logos professionnels avec l\'IA',
    icon: Palette,
    category: 'design',
    isPremium: true,
    rating: 4.6,
    usage: 0
  },
  {
    id: '4',
    name: 'Rédacteur Marketing',
    description: 'Générez du contenu marketting performant',
    icon: FileText,
    category: 'writing',
    isPremium: false,
    rating: 4.7,
    usage: 12
  },
  {
    id: '5',
    name: 'Analyseur de Marché',
    description: 'Analysez votre marché et la concurrence',
    icon: BarChart,
    category: 'analytics',
    isPremium: true,
    rating: 4.5,
    usage: 0
  },
  {
    id: '6',
    name: 'Créateur d\'Images',
    description: 'Générez des images avec l\'IA pour vos projets',
    icon: Image,
    category: 'design',
    isPremium: true,
    rating: 4.8,
    usage: 0
  }
];

interface ToolsGridProps {
  isPremium: boolean;
}

export function ToolsGrid({ isPremium }: ToolsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'Tous', icon: Grid },
    { id: 'ai', name: 'IA', icon: Brain },
    { id: 'business', name: 'Business', icon: BarChart },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'writing', name: 'Rédaction', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToolClick = (tool: Tool) => {
    if (tool.isPremium && !isPremium) {
      // Show premium modal/tooltip
      console.log('Premium required for', tool.name);
    } else {
      // Navigate to tool
      console.log('Opening tool', tool.name);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Outils IA</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un outil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-colors ${
              showFilters 
                ? 'bg-red-500 border-red-500 text-white' 
                : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>

        {/* Filtres par catégorie */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grille/Liste des outils */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
        : 'space-y-3'
      }>
        <AnimatePresence mode="popLayout">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;
            const isLocked = tool.isPremium && !isPremium;
            
            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group cursor-pointer ${
                  viewMode === 'grid' ? 'rounded-2xl' : 'rounded-xl'
                } ${
                  isLocked 
                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30' 
                    : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 hover:border-red-500/30'
                } p-6 transition-all duration-300 overflow-hidden`}
                onClick={() => handleToolClick(tool)}
                whileHover={{ scale: isLocked ? 1 : 1.02 }}
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  {tool.isNew && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      Nouveau
                    </span>
                  )}
                  {tool.isTrending && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                      Tendance
                    </span>
                  )}
                  {tool.isPremium && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                </div>

                {/* Lock overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gray-800 rounded-full p-3"
                    >
                      <Lock className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  </div>
                )}

                <div className={`relative ${isLocked ? 'opacity-60' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      isLocked 
                        ? 'bg-gray-700/50' 
                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}>
                      <Icon className={`w-6 h-6 ${isLocked ? 'text-gray-400' : 'text-white'}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className={`font-semibold text-lg ${
                      isLocked ? 'text-gray-400' : 'text-white group-hover:text-red-300'
                    } transition-colors`}>
                      {tool.name}
                    </h3>
                    
                    <p className={`text-sm ${
                      isLocked ? 'text-gray-500' : 'text-gray-300'
                    } leading-relaxed`}>
                      {tool.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Star className={`w-4 h-4 ${isLocked ? 'text-gray-500' : 'text-yellow-400'}`} />
                          <span className={`text-sm ${isLocked ? 'text-gray-500' : 'text-gray-300'}`}>
                            {tool.rating}
                          </span>
                        </div>
                        
                        {tool.usage > 0 && (
                          <div className="text-sm text-gray-400">
                            {tool.usage} utilisations
                          </div>
                        )}
                      </div>

                      {!isLocked && (
                        <div className="flex items-center space-x-1 text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Ouvrir</span>
                          <Zap className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shimmer effect */}
                {!isLocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Message si aucun résultat */}
      {filteredTools.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Aucun outil trouvé</p>
          <p className="text-sm text-gray-500 mt-2">Essayez avec d'autres mots-clés ou filtres</p>
        </motion.div>
      )}

      {/* CTA Premium */}
      {!isPremium && filteredTools.some(tool => tool.isPremium) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 text-center"
        >
          <Lock className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">Débloquez tous les outils</h3>
          <p className="text-gray-300 text-sm mb-4">
            Accédez à +20 outils IA premium, analyses avancées et fonctionnalités exclusives
          </p>
          <div className="flex items-center justify-center space-x-6 mb-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-red-400" />
              <span>Usage illimité</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Support prioritaire</span>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105">
            Passer à Premium
          </button>
        </motion.div>
      )}
    </section>
  );
} 