'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Target, 
  Zap, 
  Mail, 
  Calendar, 
  TrendingUp,
  ArrowDown,
  Sparkles,
  FileText,
  Palette,
  Lightbulb,
  Calculator,
  Package
} from 'lucide-react';
import Link from 'next/link';

const MASTERPIECES = [
  {
    id: 'icp-maker',
    title: 'ICP Maker',
    description: 'Définissez votre client idéal en 7 étapes avec analyse IA',
    icon: Target,
    href: '/outils/icp-maker',
    color: 'text-red-400'
  },
  {
    id: 'usp-maker',
    title: 'USP Maker',
    description: 'Créez votre proposition de valeur unique en 8 étapes',
    icon: Zap,
    href: '/outils/usp-maker',
    color: 'text-red-400'
  },
  {
    id: 'tunnel-maker',
    title: 'Tunnel Maker',
    description: 'Concevez votre tunnel de vente optimisé en 8 étapes',
    icon: Package,
    href: '/outils/tunnel-maker',
    color: 'text-red-400'
  },
  {
    id: 'copymoneymail',
    title: 'CopyMoneyMail',
    description: 'Générez des séquences email qui convertissent en 8 étapes',
    icon: Mail,
    href: '/outils/copymoneymail',
    color: 'text-red-400'
  },
  {
    id: 'content-system',
    title: 'Content System 90J',
    description: 'Planifiez votre contenu sur 90 jours en 8 étapes',
    icon: Calendar,
    href: '/outils/content-system',
    color: 'text-red-400'
  },

];

const BONUS_TOOLS = [
  {
    id: 'ideas-analyzer',
    title: 'Analyse d\'Idées IA',
    description: 'Analysez vos idées de produits avec IA',
    icon: Lightbulb,
    href: '/outils/ideas-analyzer',
    color: 'from-sky-500 to-indigo-500'
  },
  {
    id: 'copywriter',
    title: 'Copywriter IA',
    description: 'Générez du copywriting qui convertit',
    icon: FileText,
    href: '/outils/copywriter',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'designer',
    title: 'Designer IA',
    description: 'Créez des designs professionnels',
    icon: Palette,
    href: '/outils/designer',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'calculator',
    title: 'Calculator IA',
    description: 'Calculez vos métriques business',
    icon: Calculator,
    href: '/outils/calculator',
    color: 'from-pink-500 to-red-500'
  }
];

const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.25 } },
};

export function DropskillsRoadmap() {
  return (
    <div className="min-h-screen bg-neutral-950 py-10 md:py-20 relative overflow-hidden">
      {/* Fond animé */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0.33 }}
        animate={{ opacity: [0.33, 0.55, 0.33] }}
        transition={{ repeat: Infinity, duration: 10 }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(185,28,28,0.16), transparent 60%), radial-gradient(ellipse at 80% 60%, rgba(255,0,60,0.10), transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 relative">
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            <motion.div 
              initial={{ rotate: 0 }} 
              animate={{ rotate: [0, 16, -16, 0] }} 
              transition={{ duration: 2, repeat: Infinity }} 
              className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-xl flex items-center justify-center"
            >
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-left">
              Roadmap Succès IA Dropskills
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto">
            Suivez l'enchaînement logique des outils pour propulser votre business au sommet
          </p>
        </motion.div>

        {/* Flèche animée */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mb-8 md:mb-12"
        >
          <motion.div
            animate={{ y: [0, 22, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >
            <ArrowDown className="w-7 h-7 md:w-8 md:h-8 text-red-600" />
          </motion.div>
        </motion.div>

        {/* Timeline principale */}
        <motion.ol
          className="relative border-l-2 sm:border-l-4 border-red-600 pl-4 sm:pl-8 md:pl-10 max-w-4xl mx-auto mt-2 md:mt-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {MASTERPIECES.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.li
                key={tool.id}
                variants={item}
                className="mb-10 md:mb-16 ml-2 md:ml-4 flex items-start gap-3 md:gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: [0, 12, -12, 0] }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-neutral-800 border-2 border-red-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${tool.color}`} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <Link href={tool.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-neutral-900 rounded-xl p-4 md:p-6 border border-neutral-800 hover:border-red-500/30 transition-all duration-300"
                    >
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2">{tool.title}</h3>
                      <p className="text-neutral-400 text-sm md:text-base">{tool.description}</p>
                    </motion.div>
                  </Link>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        {/* Section Outils Bonus */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 md:mt-32"
        >
          <h2 className="text-xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12">
            Outils IA Bonus
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {BONUS_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={tool.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-neutral-900 rounded-xl p-4 md:p-6 border border-neutral-800 hover:border-red-500/30 transition-all duration-300"
                    >
                      <div className="p-2 md:p-3 bg-neutral-800 rounded-lg inline-block mb-3 md:mb-4">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">{tool.title}</h3>
                      <p className="text-neutral-400 text-xs md:text-sm">{tool.description}</p>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}