'use client';

import { motion } from 'framer-motion';
import { Zap, MessageSquare, Target, Lock } from 'lucide-react';
import { useState } from 'react';

interface QuickActionsProps {
  isPremium: boolean;
}

const actions = [
  {
    id: 'generate-strategy',
    title: 'Générer une stratégie',
    description: 'IA pour votre business',
    icon: Target,
    premium: false,
    color: 'from-red-500 to-orange-500',
    action: () => console.log('Generate strategy')
  },
  {
    id: 'ai-chat',
    title: 'Chat IA Expert',
    description: 'Assistant business 24/7',
    icon: MessageSquare,
    premium: true,
    color: 'from-blue-500 to-purple-500',
    action: () => console.log('AI Chat')
  },
  {
    id: 'instant-analysis',
    title: 'Analyse Express',
    description: 'Insights en 30 secondes',
    icon: Zap,
    premium: true,
    color: 'from-green-500 to-teal-500',
    action: () => console.log('Instant analysis')
  }
];

export function QuickActions({ isPremium }: QuickActionsProps) {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Actions Rapides</h2>
        <div className="text-sm text-gray-400">
          Accès en 1 clic
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isLocked = action.premium && !isPremium;
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              onHoverStart={() => setHoveredAction(action.id)}
              onHoverEnd={() => setHoveredAction(null)}
              className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                isLocked 
                  ? 'bg-gray-800/50 border border-gray-700/50' 
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 hover:border-red-500/30'
              }`}
              onClick={() => !isLocked && action.action()}
            >
              {/* Gradient Background */}
              {!isLocked && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 transition-opacity duration-300`}
                  animate={{ opacity: hoveredAction === action.id ? 0.1 : 0 }}
                />
              )}

              {/* Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-gray-800 rounded-full p-2"
                  >
                    <Lock className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </div>
              )}

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-xl ${
                    isLocked 
                      ? 'bg-gray-700/50' 
                      : `bg-gradient-to-br ${action.color}`
                  }`}>
                    <Icon className={`w-5 h-5 ${isLocked ? 'text-gray-400' : 'text-white'}`} />
                  </div>
                  {action.premium && (
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                
                <h3 className={`font-semibold mb-1 ${
                  isLocked ? 'text-gray-400' : 'text-white'
                }`}>
                  {action.title}
                </h3>
                
                <p className={`text-sm ${
                  isLocked ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  {action.description}
                </p>

                {/* Shimmer effect for non-locked items */}
                {!isLocked && hoveredAction === action.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA pour les utilisateurs gratuits */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-400 mb-2">
            Débloquez toutes les actions rapides
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105">
            Passer à Pro
          </button>
        </motion.div>
      )}
    </section>
  );
} 