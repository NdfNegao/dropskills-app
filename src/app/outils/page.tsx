'use client';

import React from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { BrainCog, Rocket, FolderKanban, Mail, CalendarCheck, Target, Lock } from 'lucide-react';

const AI_TOOLS = [
  {
    id: 1,
    name: "ICP Maker",
    description: "Créateur de profil client idéal avec IA",
    icon: <BrainCog className="w-8 h-8" />,
    type: "GENERATOR",
    href: "/outils/icp-maker",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "Générateur d'Offre",
    description: "Générateur d'offres irrésistibles automatisé",
    icon: <Rocket className="w-8 h-8" />,
    type: "GENERATOR",
    href: "/outils/generateur-offre",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 3,
    name: "Tunnel de Vente IA",
    description: "Assistant pour créer des tunnels de vente optimisés",
    icon: <FolderKanban className="w-8 h-8" />,
    type: "ASSISTANT",
    href: "/outils/tunnel-vente",
    color: "from-green-500 to-green-600"
  },
  {
    id: 4,
    name: "CopyMoneyMail",
    description: "Optimiseur d'emails de vente haute conversion",
    icon: <Mail className="w-8 h-8" />,
    type: "OPTIMIZER",
    href: "/outils/copy-money-mail",
    color: "from-red-500 to-red-600"
  },
  {
    id: 5,
    name: "Content System 90J",
    description: "Analyseur et planificateur de contenu sur 90 jours",
    icon: <CalendarCheck className="w-8 h-8" />,
    type: "ANALYZER",
    href: "/outils/content-system",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    id: 6,
    name: "Lead Magnet Creator",
    description: "Générateur de lead magnets attractifs",
    icon: <Target className="w-8 h-8" />,
    type: "GENERATOR",
    href: "/outils/lead-magnet",
    color: "from-indigo-500 to-indigo-600"
  }
];

export default function OutilsPage() {
  const isPremium = false; // Simuler un utilisateur non-premium
  const userPacksCount = 3;

  return (
    <LayoutWithSidebar>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Outils IA Dropskills
          </h1>
          <p className="text-gray-300 text-lg">
            6 outils d'intelligence artificielle pour booster votre business en ligne
          </p>
          
          {!isPremium && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Accès Premium Requis</span>
              </div>
              <p className="text-yellow-300 mt-1">
                Débloquez tous les outils IA avec un abonnement premium
              </p>
            </div>
          )}
        </div>

        {/* Grille des outils */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_TOOLS.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              isPremium={isPremium}
            />
          ))}
        </div>

        {/* CTA Premium */}
        {!isPremium && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#ff0033] to-red-600 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Débloquez Tous les Outils IA
              </h2>
              <p className="text-white/80 mb-6">
                Accédez aux 6 outils IA premium et boostez votre productivité
              </p>
              <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Passer Premium
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  );
}

interface ToolCardProps {
  tool: typeof AI_TOOLS[0];
  isPremium: boolean;
}

function ToolCard({ tool, isPremium }: ToolCardProps) {
  const isLocked = !isPremium;

  return (
    <div className={`relative bg-[#18181b] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all ${isLocked ? 'opacity-60' : 'hover:scale-105'}`}>
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-yellow-500" />
        </div>
      )}

      {/* Icon avec gradient */}
      <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-white mb-4`}>
        {tool.icon}
      </div>

      {/* Contenu */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {tool.name}
      </h3>
      
      <p className="text-gray-300 mb-4">
        {tool.description}
      </p>

      {/* Type badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
          {tool.type}
        </span>
        
        {isLocked ? (
          <button className="text-[#ff0033] text-sm font-medium cursor-not-allowed">
            Premium requis
          </button>
        ) : (
          <a 
            href={tool.href}
            className="text-[#ff0033] text-sm font-medium hover:underline"
          >
            Utiliser →
          </a>
        )}
      </div>
    </div>
  );
} 