'use client';

import { motion } from 'framer-motion';
import { Bot, Lightbulb, Target, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface Suggestion {
  id: string;
  type: 'strategy' | 'opportunity' | 'optimization' | 'learning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  timeToComplete: string;
  confidence: number; // 1-100
  actionUrl?: string;
}

const getSuggestions = (userPlan: 'free' | 'premium'): Suggestion[] => {
  const baseSuggestions: Suggestion[] = [
    {
      id: '1',
      type: 'strategy',
      title: 'Optimisez votre profil LinkedIn',
      description: 'Votre profil manque de mots-clés stratégiques. Ajoutez "IA", "Business" et "Innovation" for améliorer votre visibilité.',
      impact: 'medium',
      difficulty: 'easy',
      timeToComplete: '15 min',
      confidence: 89
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Explorez le marché SaaS B2B',
      description: 'Le secteur SaaS B2B affiche +23% de croissance. Considérez une solution pour PME.',
      impact: 'high',
      difficulty: 'hard',
      timeToComplete: '2-3 mois',
      confidence: 76
    }
  ];

  const premiumSuggestions: Suggestion[] = [
    {
      id: '3',
      type: 'optimization',
      title: 'Automatisez votre lead generation',
      description: 'Implémentez un funnel automatisé avec Clay + Notion. ROI estimé: +340% en 6 mois.',
      impact: 'high',
      difficulty: 'medium',
      timeToComplete: '1 semaine',
      confidence: 92
    },
    {
      id: '4',
      type: 'learning',
      title: 'Masterclass IA pour Business',
      description: 'Cours exclusif: "Comment l\'IA peut transformer votre business". Par des experts du domaine.',
      impact: 'high',
      difficulty: 'medium',
      timeToComplete: '4h',
      confidence: 95
    }
  ];

  return userPlan === 'premium' 
    ? [...baseSuggestions, ...premiumSuggestions]
    : baseSuggestions;
};

interface PersonalizedSuggestionsProps {
  isPremium: boolean;
}

export function PersonalizedSuggestions({ isPremium }: PersonalizedSuggestionsProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const suggestions = getSuggestions(isPremium ? 'premium' : 'free');

  const typeIcons = {
    strategy: Target,
    opportunity: TrendingUp,
    optimization: Bot,
    learning: Lightbulb
  };

  const typeColors = {
    strategy: 'from-blue-500 to-purple-500',
    opportunity: 'from-green-500 to-teal-500',
    optimization: 'from-red-500 to-orange-500',
    learning: 'from-yellow-500 to-orange-500'
  };

  const impactColors = {
    high: 'text-red-400 bg-red-500/20',
    medium: 'text-yellow-400 bg-yellow-500/20',
    low: 'text-green-400 bg-green-500/20'
  };

  const difficultyLabels = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile'
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Suggestions IA</h2>
        </div>
        
        <div className="text-sm text-gray-400">
          Personnalisées pour vous
        </div>
      </div>

      <div className="grid gap-4">
        {suggestions.map((suggestion, index) => {
          const Icon = typeIcons[suggestion.type];
          const isSelected = selectedSuggestion === suggestion.id;
          
          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-red-500/50' 
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 hover:border-red-500/30'
              }`}
              onClick={() => setSelectedSuggestion(isSelected ? null : suggestion.id)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${typeColors[suggestion.type]}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-white font-semibold text-lg group-hover:text-red-300 transition-colors">
                        {suggestion.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${impactColors[suggestion.impact]}`}>
                          Impact {suggestion.impact}
                        </span>
                        <span className="text-xs text-gray-400">
                          {difficultyLabels[suggestion.difficulty]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence score */}
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400">
                      {suggestion.confidence}%
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {suggestion.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>⏱️ {suggestion.timeToComplete}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    <span>Appliquer</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Expanded details */}
              <motion.div
                initial={false}
                animate={{ height: isSelected ? 'auto' : 0, opacity: isSelected ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 border-t border-gray-700/50">
                  <div className="pt-4 space-y-3">
                    <h4 className="text-white font-medium">Étapes détaillées:</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span>Analyser la situation actuelle</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span>Implémenter les changements</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span>Mesurer les résultats</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Upgrade CTA for free users */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 text-center"
        >
          <Bot className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">IA Premium débloquée</h3>
          <p className="text-gray-300 text-sm mb-4">
            Suggestions avancées, analyses prédictives et recommandations sur mesure
          </p>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span>+15 suggestions IA par mois</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Analyse prédictive</span>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105">
            Débloquer l'IA Premium
          </button>
        </motion.div>
      )}
    </section>
  );
} 