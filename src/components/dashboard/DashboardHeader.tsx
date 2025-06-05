'use client';

import { motion } from 'framer-motion';
import { BarChart3, Flame, Clock, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  user: any;
  stats: any;
}

export default function DashboardHeader({ user, stats }: DashboardHeaderProps) {
  const userName = user?.firstName || 
    user?.name?.split(' ')[0] || 
    user?.email?.split('@')[0] || 
    'Entrepreneur';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getMotivationalMessage = () => {
    if (!stats) return "Prêt à transformer vos idées en business ?";
    
    if (stats.businessScore >= 80) {
      return "Vous êtes sur la bonne voie ! 🚀";
    } else if (stats.businessScore >= 60) {
      return "Continuez comme ça, c'est prometteur ! 💪";
    } else if (stats.streakDays >= 3) {
      return `${stats.streakDays} jours de suite, excellent ! 🔥`;
    } else {
      return "Chaque action vous rapproche du succès ! ✨";
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff0033]/10 via-purple-500/5 to-blue-500/10 rounded-2xl" />
      
      {/* Glass effect */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          
          {/* Left side - Welcome message */}
          <div className="flex items-center gap-6">
            {/* Animated icon */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-2xl flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ 
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                />
                <BarChart3 className="w-8 h-8 text-white relative z-10" />
              </div>
              
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 bg-[#ff0033]/30 rounded-2xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            <div>
              <motion.h1 
                className="text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {getGreeting()} {userName} 👋
              </motion.h1>
              
              <motion.p 
                className="text-gray-300 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {getMotivationalMessage()}
              </motion.p>
            </div>
          </div>

          {/* Right side - Quick stats */}
          <motion.div 
            className="hidden lg:flex items-center gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Streak counter */}
            {stats?.streakDays && (
              <motion.div 
                className="flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-xl border border-orange-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flame className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-orange-400 font-bold text-lg">{stats.streakDays}</div>
                  <div className="text-orange-300 text-xs">jours de suite</div>
                </div>
              </motion.div>
            )}

            {/* Time indicator */}
            <motion.div 
              className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-blue-400 font-bold text-lg">
                  {new Date().toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-blue-300 text-xs">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom progress hint */}
        <motion.div 
          className="mt-6 pt-4 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Votre centre de contrôle DropSkills
            </span>
            <span className="text-gray-500">
              Dernière connexion: {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 