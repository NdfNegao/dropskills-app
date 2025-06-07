'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lightbulb, Target, Package, Calendar, Brain, ChevronRight, CheckCircle } from 'lucide-react';
import Crown from '@/components/ui/Crown';

interface PersonalizedSuggestionsProps {
  canAccessPremium: boolean;
  stats: any;
}

export default function PersonalizedSuggestions({ canAccessPremium, stats }: PersonalizedSuggestionsProps) {
  const getPersonalizedSuggestions = () => {
    if (canAccessPremium) {
      return [
        {
          title: "Optimisez votre ICP",
          description: "Affinez votre client idéal avec l'IA",
          icon: Target,
          action: "/outils/icp-generator",
          type: "optimization",
          color: "from-blue-400 to-blue-600",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30"
        },
        {
          title: "Créez votre tunnel de vente",
          description: "Automatisez vos conversions",
          icon: Package,
          action: "/outils/tunnel-maker",
          type: "growth",
          color: "from-purple-400 to-purple-600",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30"
        },
        {
          title: "Planifiez 90 jours de contenu",
          description: "Stratégie content marketing complète",
          icon: Calendar,
          action: "/outils/content-system",
          type: "content",
          color: "from-green-400 to-green-600",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30"
        }
      ];
    } else {
      return [
        {
          title: "Passez Premium pour débloquer",
          description: "15+ outils IA pour entrepreneurs",
          icon: Crown,
          action: "/premium",
          type: "upgrade",
          color: "from-[#ff0033] to-[#cc0029]",
          bgColor: "bg-[#ff0033]/10",
          borderColor: "border-[#ff0033]/30"
        },
        {
          title: "Testez ICP Generator",
          description: "Gratuit - Définissez votre client idéal",
          icon: Target,
          action: "/outils/icp-generator",
          type: "trial",
          color: "from-blue-400 to-blue-600",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30"
        },
        {
          title: "Découvrez nos formations",
          description: "27 formations gratuites disponibles",
          icon: Brain,
          action: "/universite",
          type: "education",
          color: "from-purple-400 to-purple-600",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30"
        }
      ];
    }
  };

  const suggestions = getPersonalizedSuggestions();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Lightbulb className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">🎯 Suggestions pour vous</h2>
            <p className="text-gray-400">Actions recommandées pour booster votre business</p>
          </div>
        </div>
        
        {canAccessPremium && (
          <motion.div
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-4 py-2 rounded-xl flex items-center gap-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Crown size="sm" color="yellow" />
            <span className="text-yellow-400 font-semibold text-sm">Premium Actif</span>
          </motion.div>
        )}
      </div>

      {/* Suggestions Grid */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={suggestion.action}
              className={`group block ${suggestion.bgColor} backdrop-blur-xl border ${suggestion.borderColor} rounded-2xl p-6 transition-all duration-300 hover:border-[#ff0033]/50 relative overflow-hidden`}
            >
              {/* Background glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Premium glow for upgrade suggestion */}
              {suggestion.type === 'upgrade' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#ff0033]/10 via-transparent to-[#ff0033]/10 rounded-2xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${suggestion.color} rounded-xl flex items-center justify-center mb-4 relative overflow-hidden`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ 
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 4,
                      ease: "easeInOut"
                    }}
                  />
                  <suggestion.icon className="w-6 h-6 text-white relative z-10" />
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#ff0033] transition-colors">
                      {suggestion.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {suggestion.description}
                    </p>
                  </div>

                  {/* Type indicator and arrow */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      suggestion.type === 'upgrade' ? 'text-[#ff0033] bg-[#ff0033]/20 border border-[#ff0033]/30' :
                      suggestion.type === 'trial' ? 'text-green-400 bg-green-400/20 border border-green-400/30' :
                      suggestion.type === 'education' ? 'text-purple-400 bg-purple-400/20 border border-purple-400/30' :
                      'text-blue-400 bg-blue-400/20 border border-blue-400/30'
                    }`}>
                      {suggestion.type === 'upgrade' ? '🚀 Upgrade' :
                       suggestion.type === 'trial' ? '✓ Gratuit' :
                       suggestion.type === 'education' ? '📚 Formation' :
                       '⚡ Action'}
                    </span>
                    
                    <motion.div
                      className="text-gray-400 group-hover:text-[#ff0033] transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress hint for free users */}
      {!canAccessPremium && stats && (
        <motion.div
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-2">Votre progression DropSkills</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Compte créé et premier outil testé</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-2 border-gray-500 rounded-full" />
                  <span className="text-gray-500">Passer Premium pour débloquer tous les outils</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-2 border-gray-500 rounded-full" />
                  <span className="text-gray-500">Atteindre un score business de 80+</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-[#ff0033]">{stats.businessScore}/100</div>
              <div className="text-gray-400 text-sm">Score Business</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-[#ff0033] to-[#cc0029]"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.businessScore / 100) * 100}%` }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}