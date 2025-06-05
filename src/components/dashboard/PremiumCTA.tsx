'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Rocket, Crown, Star, Heart, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function PremiumCTA() {
  const features = [
    { icon: CheckCircle, text: "15+ Outils IA Premium" },
    { icon: CheckCircle, text: "Générations illimitées" },
    { icon: CheckCircle, text: "Support prioritaire 24/7" },
    { icon: CheckCircle, text: "Nouvelles fonctionnalités en avant-première" }
  ];

  const stats = [
    { value: "15+", label: "Outils IA" },
    { value: "∞", label: "Générations" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-br from-[#ff0033]/20 via-[#cc0029]/10 to-purple-500/20 border border-[#ff0033]/30 rounded-3xl p-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff0033]/5 via-transparent to-purple-500/5" />
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-[#ff0033]/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Icon */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-3xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ 
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
          <Rocket className="w-10 h-10 text-white relative z-10" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Prêt à transformer votre business ?
        </motion.h2>

        <motion.p
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Rejoignez <strong className="text-[#ff0033]">2,847 entrepreneurs</strong> qui utilisent DropSkills Premium pour automatiser leur croissance et générer plus de revenus.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center gap-12 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-4xl font-bold text-[#ff0033] mb-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: index * 0.3,
                  ease: "easeInOut" 
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                <feature.icon className="w-5 h-5 text-green-400" />
              </motion.div>
              <span className="text-white font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/premium"
              className="group bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-[#cc0029] hover:to-[#990022] transition-all duration-300 flex items-center gap-3 relative overflow-hidden"
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
              <Crown className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Passer Premium</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/universite"
              className="border-2 border-[#ff0033] text-[#ff0033] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ff0033]/10 transition-all duration-300 flex items-center gap-3"
            >
              <Heart className="w-6 h-6" />
              <span>Formations Gratuites</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Guarantee */}
        <motion.p
          className="text-sm text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Star className="w-4 h-4 inline mr-1" />
          Garantie satisfait ou remboursé 30 jours • Annulation possible à tout moment
        </motion.p>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-60"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-6 h-6 bg-purple-400 rounded-full opacity-40"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-5 w-3 h-3 bg-blue-400 rounded-full opacity-50"
          animate={{ 
            x: [0, 20, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
    </motion.div>
  );
} 