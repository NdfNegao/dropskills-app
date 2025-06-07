'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Bot, Search, Filter, Lock, ChevronRight, Grid, List } from 'lucide-react';
import Crown from '@/components/ui/Crown';
import { AiToolsGrid } from '@/components/AiToolsGrid';

interface ToolsGridProps {
  canAccessPremium: boolean;
}

export default function ToolsGrid({ canAccessPremium }: ToolsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', name: 'Tous', count: 15 },
    { id: 'acquisition', name: 'Acquisition', count: 4 },
    { id: 'activation', name: 'Activation', count: 3 },
    { id: 'retention', name: 'Rétention', count: 3 },
    { id: 'revenue', name: 'Revenus', count: 3 },
    { id: 'referral', name: 'Référence', count: 2 }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
            className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">🤖 Outils IA Business</h2>
            <p className="text-gray-400">
              {canAccessPremium 
                ? "Tous vos outils IA sont débloqués" 
                : "3/15 outils disponibles - Upgrade pour tout débloquer"
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!canAccessPremium && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/premium"
                className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-4 py-2 rounded-xl hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 flex items-center gap-2 text-sm font-semibold"
              >
                <Crown size="sm" color="white" />
                Débloquer Tout
              </Link>
            </motion.div>
          )}
          <Link 
            href="/outils"
            className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
          >
            Voir tous les outils
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <motion.div
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un outil IA..."
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#ff0033]/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters and View Mode */}
          <div className="flex items-center justify-between">
            {/* Category Filters */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-[#ff0033] text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name} ({category.count})
                  </motion.button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-[#ff0033] text-white' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-[#ff0033] text-white' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <AiToolsGrid className={`${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`} />
        </motion.div>
      </motion.div>

      {/* Premium Tools Preview for Free Users */}
      {!canAccessPremium && (
        <motion.div
          className="bg-gradient-to-r from-[#ff0033]/10 via-[#cc0029]/5 to-[#ff0033]/10 border border-[#ff0033]/30 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="text-center space-y-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-2xl flex items-center justify-center mx-auto"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                13 outils IA premium vous attendent
              </h3>
              <p className="text-gray-400 mb-4">
                Débloquez l'arsenal complet d'outils IA pour transformer votre business
              </p>
            </div>

            {/* Premium Tools Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                'Tunnel Builder IA',
                'CopyMoney Mail', 
                'Content System 90J',
                'Lead Magnet Creator'
              ].map((tool, index) => (
                <motion.div
                  key={tool}
                  className="bg-black/40 border border-white/10 rounded-xl p-3 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-400">{tool}</p>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/premium"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200"
              >
                <Crown size="sm" color="white" />
                Débloquer tous les outils
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}