'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  timeAgo: string;
  source: string;
  url?: string;
  trend: 'up' | 'down' | 'stable';
  impact: number; // 1-10
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'IA générative en forte croissance',
    description: 'Le marché de l\'IA générative devrait atteindre 51.8 milliards USD d\'ici 2028',
    category: 'Technologie',
    priority: 'high',
    timeAgo: '2h',
    source: 'TechCrunch',
    trend: 'up',
    impact: 9
  },
  {
    id: '2',
    title: 'Nouveau financement disponible',
    description: 'Programme de subvention BPI France pour les startups tech',
    category: 'Financement',
    priority: 'high',
    timeAgo: '4h',
    source: 'BPI France',
    trend: 'up',
    impact: 8
  },
  {
    id: '3',
    title: 'Partenariat stratégique possible',
    description: 'Microsoft lance un programme d\'accélération pour les solutions B2B',
    category: 'Partenariat',
    priority: 'medium',
    timeAgo: '1j',
    source: 'Microsoft',
    trend: 'stable',
    impact: 7
  }
];

interface OpportunitiesSectionProps {
  isPremium: boolean;
}

export function OpportunitiesSection({ isPremium }: OpportunitiesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Technologie', 'Financement', 'Partenariat'];
  
  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const priorityColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-yellow-500 to-orange-500',
    low: 'from-green-500 to-teal-500'
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    stable: '➡️'
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Veille Business</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Mis à jour il y a 1h</span>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher des opportunités..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
        
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {category === 'all' ? 'Tout' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des opportunités */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300"
            >
              {/* Priority indicator */}
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-r ${priorityColors[opportunity.priority]}`} />
              
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{trendIcons[opportunity.trend]}</span>
                    <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                      {opportunity.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      il y a {opportunity.timeAgo}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-red-300 transition-colors">
                    {opportunity.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {opportunity.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">
                    Source: <span className="text-gray-300">{opportunity.source}</span>
                  </div>
                  
                  {/* Impact score */}
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      Impact: {opportunity.impact}/10
                    </span>
                  </div>
                </div>

                {opportunity.url && (
                  <button className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors">
                    <span>Voir plus</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message si aucun résultat */}
      {filteredOpportunities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Aucune opportunité trouvée</p>
          <p className="text-sm text-gray-500 mt-2">Essayez avec d'autres mots-clés</p>
        </motion.div>
      )}

      {/* CTA Premium */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 text-center"
        >
          <h3 className="text-white font-semibold mb-2">Débloquez la veille premium</h3>
          <p className="text-gray-300 text-sm mb-4">
            Accédez à +50 sources, alertes personnalisées et analyses approfondies
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105">
            Voir les offres Premium
          </button>
        </motion.div>
      )}
    </section>
  );
} 