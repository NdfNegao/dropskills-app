'use client';

import { motion } from 'framer-motion';
import { BarChart3, Bot, Zap, Trophy, Crown, DollarSign } from 'lucide-react';

interface StatsOverviewProps {
  stats: any;
  canAccessPremium: boolean;
}

export default function StatsOverview({ stats, canAccessPremium }: StatsOverviewProps) {
  if (!stats) return null;

  const getBusinessScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getBusinessScoreText = (score: number) => {
    if (score >= 80) return 'Expert';
    if (score >= 60) return 'Avancé';
    if (score >= 40) return 'Intermédiaire';
    return 'Débutant';
  };

  const dashboardStats = [
    {
      icon: BarChart3,
      label: "Opportunités",
      value: stats.totalOpportunities,
      suffix: "",
      color: "from-blue-400 to-blue-600",
      description: "Détectées ce mois",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <Bot className="w-5 h-5" />,
      label: "Outils Utilisés",
      value: stats.toolsUsed,
      suffix: "/15",
      color: canAccessPremium ? "from-green-400 to-green-600" : "from-orange-400 to-orange-600",
      description: canAccessPremium ? "Accès complet" : "Limité",
      bgColor: canAccessPremium ? "bg-green-500/10" : "bg-orange-500/10",
      borderColor: canAccessPremium ? "border-green-500/30" : "border-orange-500/30"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Générations",
      value: stats.generationsThisMonth,
      suffix: "",
      color: "from-purple-400 to-purple-600",
      description: "Ce mois",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "Score Business",
      value: stats.businessScore,
      suffix: "/100",
      color: getBusinessScoreColor(stats.businessScore),
      description: getBusinessScoreText(stats.businessScore),
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      showProgress: true,
      progress: stats.businessScore
    }
  ];

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
      {/* Premium Status Banner */}
      {canAccessPremium && (
        <motion.div
          className="bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-yellow-400 font-semibold">Premium Actif</h3>
              <p className="text-yellow-300/80 text-sm">Accès complet à tous les outils DropSkills</p>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold text-lg">∞</div>
              <div className="text-yellow-300/80 text-xs">Générations</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`relative overflow-hidden ${stat.bgColor} backdrop-blur-xl border ${stat.borderColor} rounded-2xl p-6 group hover:scale-[1.02] transition-transform duration-300`}
            variants={cardVariants}
            whileHover={{ y: -2 }}
          >
            {/* Background glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Icon */}
            <motion.div
              className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 relative overflow-hidden`}
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
              {stat.icon && typeof stat.icon === 'function' ? (
                <stat.icon className="w-6 h-6 text-white relative z-10" />
              ) : null}
            </motion.div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.label}
                </span>
              </div>
              
              <div className="flex items-baseline gap-1">
                <motion.span
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                >
                  {stat.value}
                </motion.span>
                {stat.suffix && (
                  <span className="text-lg text-gray-400">{stat.suffix}</span>
                )}
              </div>
              
              <p className="text-xs text-gray-400">{stat.description}</p>

              {/* Progress bar for business score */}
              {stat.showProgress && (
                <div className="mt-3">
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue card for premium users */}
      {canAccessPremium && stats.totalRevenue > 0 && (
        <motion.div
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-green-400 font-semibold">Revenus Générés</h3>
                <p className="text-green-300/80 text-sm">Grâce aux outils DropSkills</p>
              </div>
            </div>
            <div className="text-right">
              <motion.div
                className="text-3xl font-bold text-green-400"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                {stats.totalRevenue.toLocaleString('fr-FR')}€
              </motion.div>
              <div className="text-green-300/80 text-sm">Ce mois</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}