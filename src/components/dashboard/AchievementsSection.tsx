'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Trophy, CheckCircle, Clock, Info, Sparkles } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress?: number;
  unlockedAt?: string;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

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

  const confettiVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Trophy className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">🏆 Vos Succès</h2>
            <p className="text-gray-400">
              {unlockedCount}/{totalCount} achievements débloqués
            </p>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">{Math.round(progressPercentage)}%</div>
          <div className="text-gray-400 text-sm">Progression globale</div>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">Progression des achievements</span>
          <span className="text-yellow-400 font-bold">{unlockedCount}/{totalCount}</span>
        </div>
        
        <div className="w-full bg-gray-700/50 rounded-full h-3 relative overflow-hidden">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 relative"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`relative cursor-pointer ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                : 'bg-black/40 border-white/10'
            } backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group`}
            variants={cardVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAchievement(achievement)}
          >
            {/* Unlock confetti effect */}
            <AnimatePresence>
              {achievement.unlocked && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  variants={confettiVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + (i % 2) * 20}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [1, 0.5, 1],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Achievement content */}
            <div className="relative z-10">
              {/* Icon and status */}
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-gray-500/20'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <achievement.icon className={`w-6 h-6 ${
                    achievement.unlocked ? 'text-white' : 'text-gray-500'
                  }`} />
                </motion.div>
                
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </motion.div>
                )}
              </div>

              {/* Title and description */}
              <div className="space-y-2">
                <h3 className={`font-semibold ${
                  achievement.unlocked ? 'text-white' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm ${
                  achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
              </div>

              {/* Progress bar for incomplete achievements */}
              {achievement.progress !== undefined && !achievement.unlocked && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progression</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ delay: index * 0.1 + 0.7, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Unlock date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400">
                  <Clock className="w-3 h-3" />
                  <span>Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              )}

              {/* Hover info icon */}
              <motion.div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <Info className="w-4 h-4 text-gray-400" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    selectedAchievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-gray-500/20'
                  }`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <selectedAchievement.icon className={`w-10 h-10 ${
                    selectedAchievement.unlocked ? 'text-white' : 'text-gray-500'
                  }`} />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedAchievement.title}
                </h3>
                <p className="text-gray-400 mb-6">
                  {selectedAchievement.description}
                </p>
                
                {selectedAchievement.unlocked ? (
                  <div className="space-y-4">
                    <motion.div
                      className="flex items-center justify-center gap-2 text-green-400"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Achievement débloqué !</span>
                    </motion.div>
                    {selectedAchievement.unlockedAt && (
                      <p className="text-sm text-gray-400">
                        Débloqué le {new Date(selectedAchievement.unlockedAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-400">
                      <Sparkles className="w-6 h-6 mx-auto mb-2" />
                      <p>Continuez à utiliser DropSkills pour débloquer cet achievement !</p>
                    </div>
                    {selectedAchievement.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Progression</span>
                          <span>{selectedAchievement.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <motion.div
                            className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedAchievement.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <motion.button
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white rounded-xl font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAchievement(null)}
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 