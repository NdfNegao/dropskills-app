'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Zap, Award, X, PartyPopper } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number; // 0-100
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt?: string;
  category: 'usage' | 'business' | 'social' | 'milestone';
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Premier Pas',
    description: 'Connectez-vous pour la première fois',
    icon: <Star className="w-6 h-6" />,
    progress: 100,
    maxProgress: 1,
    unlocked: true,
    rarity: 'common',
    xpReward: 50,
    unlockedAt: 'Il y a 2 jours',
    category: 'milestone'
  },
  {
    id: '2',
    title: 'Stratège',
    description: 'Générez 5 stratégies business',
    icon: <Target className="w-6 h-6" />,
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    rarity: 'rare',
    xpReward: 200,
    category: 'usage'
  },
  {
    id: '3',
    title: 'Machine à Idées',
    description: 'Utilisez 10 outils IA différents',
    icon: <Zap className="w-6 h-6" />,
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    rarity: 'epic',
    xpReward: 500,
    category: 'usage'
  },
  {
    id: '4',
    title: 'Entrepreneur Visionnaire',
    description: 'Lancez votre premier projet',
    icon: <Trophy className="w-6 h-6" />,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: 'legendary',
    xpReward: 1000,
    category: 'business'
  }
];

interface AchievementsSectionProps {
  userLevel: number;
  totalXp: number;
}

export function AchievementsSection({ userLevel, totalXp }: AchievementsSectionProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  };

  const rarityBorders = {
    common: 'border-gray-500/50',
    rare: 'border-blue-500/50',
    epic: 'border-purple-500/50',
    legendary: 'border-yellow-500/50 shadow-yellow-500/20 shadow-lg'
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const progressAchievements = achievements.filter(a => !a.unlocked && a.progress > 0);
  const lockedAchievements = achievements.filter(a => !a.unlocked && a.progress === 0);

  // Simulate achievement unlock
  const simulateUnlock = (achievement: Achievement) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Succès</h2>
            <p className="text-sm text-gray-400">Niveau {userLevel} • {totalXp} XP</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">Progression</div>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${(totalXp % 1000) / 10}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="text-xs text-gray-400">{totalXp % 1000}/1000</span>
          </div>
        </div>
      </div>

      {/* Achievements débloqués */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-green-400" />
            <h3 className="text-white font-medium">Débloqués ({unlockedAchievements.length})</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {unlockedAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-gradient-to-br from-gray-800/80 to-gray-900/80 ${rarityBorders[achievement.rarity]}`}
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]} mb-2`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-green-400">+{achievement.xpReward} XP</p>
                  </div>
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
                    animate={{ 
                      opacity: [0, 1, 0],
                      x: ['-100%', '100%'] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements en cours */}
      {progressAchievements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-medium">En cours ({progressAchievements.length})</h3>
          </div>
          
          <div className="grid gap-3">
            {progressAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border bg-gradient-to-br from-gray-800/80 to-gray-900/80 ${rarityBorders[achievement.rarity]} hover:border-opacity-100 transition-all duration-300 cursor-pointer`}
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        <span className="text-sm text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        />
                      </div>
                      
                      <p className="text-xs text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements verrouillés */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded" />
            <h3 className="text-gray-400 font-medium">À débloquer ({lockedAchievements.length})</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lockedAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative p-4 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <div className="text-center">
                    <div className="inline-flex p-3 rounded-full bg-gray-700 mb-2">
                      <Icon className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="text-gray-400 font-medium text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-gray-500">+{achievement.xpReward} XP</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal détail achievement */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${rarityBorders[selectedAchievement.rarity]} rounded-2xl p-6 max-w-md w-full`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${rarityColors[selectedAchievement.rarity]}`}>
                  <selectedAchievement.icon className="w-8 h-8 text-white" />
                </div>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{selectedAchievement.title}</h3>
              <p className="text-gray-300 mb-4">{selectedAchievement.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rareté:</span>
                  <span className={`capitalize ${
                    selectedAchievement.rarity === 'legendary' ? 'text-yellow-400' :
                    selectedAchievement.rarity === 'epic' ? 'text-purple-400' :
                    selectedAchievement.rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'
                  }`}>{selectedAchievement.rarity}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Récompense:</span>
                  <span className="text-yellow-400">+{selectedAchievement.xpReward} XP</span>
                </div>
                
                {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Débloqué:</span>
                    <span className="text-green-400">{selectedAchievement.unlockedAt}</span>
                  </div>
                )}
                
                {!selectedAchievement.unlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progression:</span>
                      <span className="text-blue-400">
                        {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${rarityColors[selectedAchievement.rarity]}`}
                        style={{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: Math.random() * 360,
                x: Math.random() * window.innerWidth
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}