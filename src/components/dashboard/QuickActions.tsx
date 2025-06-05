'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Package, Mail, Lock, ChevronRight, Sparkles, Crown } from 'lucide-react';

interface QuickActionsProps {
  canAccessPremium: boolean;
}

export default function QuickActions({ canAccessPremium }: QuickActionsProps) {
  const quickActions = [
    {
      id: 'icp-maker',
      title: 'ICP Maker IA',
      description: 'Définissez votre client idéal',
      icon: Target,
      href: '/outils/icp-maker',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      isPremium: false,
      badge: '✓ Gratuit'
    },
    {
      id: 'tunnel-builder',
      title: 'Tunnel Builder IA',
      description: 'Créez vos tunnels de vente',
      icon: Package,
      href: canAccessPremium ? '/outils/tunnel-maker' : '/premium',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      isPremium: true,
      badge: canAccessPremium ? '✓ Premium' : '🔒 Premium'
    },
    {
      id: 'copymoneymail',
      title: 'CopyMoney Mail',
      description: 'Emails qui convertissent',
      icon: Mail,
      href: canAccessPremium ? '/outils/copymoneymail' : '/premium',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      isPremium: true,
      badge: canAccessPremium ? '✓ Premium' : '🔒 Premium'
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
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">⚡ Actions Rapides</h2>
            <p className="text-gray-400">Vos outils les plus utilisés</p>
          </div>
        </div>
        
        <Link
          href="/outils"
          className="text-[#ff0033] hover:text-[#cc0029] text-sm font-medium flex items-center gap-1 transition-colors"
        >
          Voir tous les outils
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Actions Grid */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className={`group relative block ${action.bgColor} backdrop-blur-xl border ${action.borderColor} rounded-2xl p-6 transition-all duration-300 hover:border-[#ff0033]/50 overflow-hidden`}
            >
              {/* Premium Lock Overlay */}
              {action.isPremium && !canAccessPremium && (
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lock className="w-8 h-8 text-[#ff0033] mx-auto mb-2" />
                    </motion.div>
                    <span className="text-sm font-medium text-white">Premium Requis</span>
                  </div>
                </motion.div>
              )}

              {/* Background glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Premium glow for unlocked premium tools */}
              {action.isPremium && canAccessPremium && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 rounded-2xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <div className="relative z-20">
                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden`}
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
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                  <action.icon className="w-7 h-7 text-white relative z-10" />
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#ff0033] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {action.description}
                    </p>
                  </div>

                  {/* Badge and Arrow */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      action.isPremium 
                        ? canAccessPremium 
                          ? 'text-yellow-400 bg-yellow-400/20 border border-yellow-400/30' 
                          : 'text-[#ff0033] bg-[#ff0033]/20 border border-[#ff0033]/30'
                        : 'text-green-400 bg-green-400/20 border border-green-400/30'
                    }`}>
                      {action.badge}
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

      {/* Upgrade CTA for free users */}
      {!canAccessPremium && (
        <motion.div
          className="bg-gradient-to-r from-[#ff0033]/10 via-[#cc0029]/5 to-[#ff0033]/10 border border-[#ff0033]/30 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-[#ff0033] font-semibold">Débloquez 13 outils premium</h3>
                <p className="text-gray-400 text-sm">Tunnel Builder, CopyMoney Mail, Content System et plus...</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/premium"
                className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade Premium
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 