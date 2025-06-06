'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Search, Plus, Lock, ChevronRight, Eye, Calendar, Tag } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  source: string;
  relevance_score: number;
  priority_level: string;
  status: string;
  tags: string[];
  sector: string;
  created_at: string;
}

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
  canAccessPremium: boolean;
}

export default function OpportunitiesSection({ opportunities, canAccessPremium }: OpportunitiesSectionProps) {
  const [searchKeywords, setSearchKeywords] = useState('');

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'low': return 'bg-green-500/20 border-green-500/30 text-green-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const launchVeille = async () => {
    if (!searchKeywords.trim()) return;
    
    try {
      const response = await fetch('/api/dashboard/veille/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: searchKeywords })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message}`);
        // Recharger les opportunités si besoin
        window.location.reload();
      } else {
        alert(`❌ Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lancement veille:', error);
      alert('❌ Erreur lors du lancement de la veille');
    }
    
    setSearchKeywords('');
  };

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">📊 Opportunités Business</h2>
            <p className="text-gray-400">
              {opportunities.length} opportunités détectées par votre veille IA
            </p>
          </div>
        </div>
        
        <Link
          href="/veille/nouvelle"
          className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Veille
        </Link>
      </div>

      {/* Quick Veille Interface */}
      <motion.div
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          {/* Premium limitation notice */}
          {!canAccessPremium && (
            <motion.div
              className="bg-[#ff0033]/10 border border-[#ff0033]/30 rounded-xl p-4 flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Lock className="w-5 h-5 text-[#ff0033]" />
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  <strong>Version limitée :</strong> La veille premium débloque LinkedIn, ProductHunt, Crunchbase et analyses IA avancées.
                </p>
              </div>
              <Link
                href="/premium"
                className="text-[#ff0033] hover:text-[#cc0029] text-sm font-medium transition-colors"
              >
                Upgrade →
              </Link>
            </motion.div>
          )}
          
          {/* Search Interface */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Mots-clés séparés par des virgules (ex: startup, fintech, levée de fonds)"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#ff0033]/50 transition-colors"
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && launchVeille()}
              />
            </div>
            <motion.button
              onClick={launchVeille}
              disabled={!searchKeywords.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white rounded-xl font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search className="w-4 h-4" />
              {canAccessPremium ? 'Lancer Veille Pro' : 'Lancer Veille'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Opportunities List */}
      {opportunities.length > 0 && (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {opportunities.slice(0, 5).map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#ff0033]/30 transition-all duration-300 group"
              variants={cardVariants}
              whileHover={{ y: -2 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#ff0033] transition-colors">
                    {opportunity.title}
                  </h3>
                  <p className="text-gray-400 mt-1">{opportunity.description}</p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBg(opportunity.priority_level)}`}>
                    {opportunity.priority_level}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 border border-blue-500/30 text-blue-400">
                    Score: {opportunity.relevance_score}%
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-gray-500" />
                <div className="flex gap-2">
                  {opportunity.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-500/20 border border-gray-500/30 rounded-lg text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {opportunity.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-500/20 border border-gray-500/30 rounded-lg text-xs text-gray-400">
                      +{opportunity.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Source: {opportunity.source}</span>
                  <span>Secteur: {opportunity.sector}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(opportunity.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* View All Link */}
          {opportunities.length > 5 && (
            <motion.div
              className="text-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/dashboard/opportunities"
                className="text-[#ff0033] hover:text-[#cc0029] font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Voir toutes les opportunités ({opportunities.length})
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {opportunities.length === 0 && (
        <motion.div
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Search className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucune opportunité détectée</h3>
          <p className="text-gray-400 mb-6">
            Lancez votre première veille pour découvrir des opportunités business personnalisées
          </p>
          <motion.button
            onClick={() => setSearchKeywords('startup, fintech, saas')}
            className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Essayer avec des mots-clés exemple
          </motion.button>
        </motion.div>
      )}
    </div>
  );
} 