'use client';

import React, { useState } from 'react';
import { ChevronRight, Target, Users, RotateCcw, Share2, DollarSign, Sparkles } from 'lucide-react';
import { AiToolCard } from './AiToolCard';
import { AI_TOOLS } from '@/data/ai-tools';

interface AARRRPhase {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  step?: number;
  category?: string;
}

const AARRR_PHASES: AARRRPhase[] = [
  {
    id: 'acquisition',
    title: 'ACQUISITION',
    description: 'Attirer de nouveaux prospects et visiteurs',
    icon: <Target className="w-6 h-6" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    step: 1,
    category: 'Acquisition'
  },
  {
    id: 'activation',
    title: 'ACTIVATION',
    description: 'Convertir les visiteurs en utilisateurs actifs',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    step: 2,
    category: 'Activation'
  },
  {
    id: 'retention',
    title: 'RÉTENTION',
    description: 'Fidéliser et engager vos utilisateurs',
    icon: <RotateCcw className="w-6 h-6" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    step: 3,
    category: 'Trafic'
  },
  {
    id: 'referral',
    title: 'RECOMMANDATION',
    description: 'Transformer vos clients en ambassadeurs',
    icon: <Share2 className="w-6 h-6" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    step: 4,
    category: 'Contenu'
  },
  {
    id: 'revenue',
    title: 'REVENUS',
    description: 'Monétiser et maximiser la valeur client',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    step: 5,
    category: 'Acquisition'
  }
];

export function AARRRJourney() {
  const [selectedPhase, setSelectedPhase] = useState<string>('acquisition');

  const getToolsForPhase = (phase: AARRRPhase) => {
    return AI_TOOLS.filter(tool => {
      // Mapping des phases AARRR vers les catégories/étapes existantes
      switch (phase.id) {
        case 'acquisition':
          return tool.category === 'Acquisition' || tool.stepTitle === 'ACQUISITION';
        case 'activation':
          return tool.category === 'Activation' || tool.stepTitle === 'ACTIVATION';
        case 'retention':
        case 'referral':
          return tool.category === 'Trafic' || tool.stepTitle === 'TRAFIC';
        case 'revenue':
          return tool.category === 'Contenu' || tool.stepTitle === 'CONTENU';
        default:
          return false;
      }
    });
  };

  const selectedPhaseData = AARRR_PHASES.find(p => p.id === selectedPhase);
  const phaseTools = selectedPhaseData ? getToolsForPhase(selectedPhaseData) : [];

  return (
    <div className="space-y-8">
      {/* Header - Titre géré par la page parent */}

      {/* Journey Visualization */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 transform -translate-y-1/2 z-0" />
        
        {/* Phases */}
        <div className="relative z-10 flex justify-between items-center">
          {AARRR_PHASES.map((phase, index) => (
            <div key={phase.id} className="flex flex-col items-center">
              {/* Phase Circle */}
              <button
                onClick={() => setSelectedPhase(phase.id)}
                className={`
                  relative w-16 h-16 rounded-full border-4 transition-all duration-300 hover:scale-110
                  ${selectedPhase === phase.id 
                    ? `${phase.bgColor} border-white shadow-lg` 
                    : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                  }
                `}
              >
                <div className={`
                  flex items-center justify-center w-full h-full rounded-full
                  ${selectedPhase === phase.id ? phase.color : 'text-gray-400'}
                `}>
                  {phase.icon}
                </div>
                
                {/* Step Number */}
                <div className={`
                  absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
                  ${selectedPhase === phase.id 
                    ? 'bg-white text-gray-900' 
                    : 'bg-gray-700 text-gray-300'
                  }
                `}>
                  {phase.step}
                </div>
              </button>
              
              {/* Phase Label */}
              <div className="mt-4 text-center">
                <h3 className={`
                  font-semibold text-sm transition-colors
                  ${selectedPhase === phase.id ? 'text-white' : 'text-gray-400'}
                `}>
                  {phase.title}
                </h3>
              </div>
              
              {/* Arrow */}
              {index < AARRR_PHASES.length - 1 && (
                <ChevronRight className="absolute top-1/2 transform -translate-y-1/2 translate-x-12 text-gray-600 w-4 h-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Phase Details */}
      {selectedPhaseData && (
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-lg ${selectedPhaseData.bgColor}`}>
              <div className={selectedPhaseData.color}>
                {selectedPhaseData.icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {selectedPhaseData.title}
              </h2>
              <p className="text-gray-400">
                {selectedPhaseData.description}
              </p>
            </div>
          </div>

          {/* Tools for this phase */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Outils recommandés ({phaseTools.length})
            </h3>
            
            {phaseTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phaseTools.map((tool) => (
                  <AiToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">Aucun outil disponible pour cette phase</p>
                <p className="text-sm text-gray-500 mt-2">
                  De nouveaux outils seront bientôt ajoutés
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Framework Info */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-800/30">
        <h3 className="text-xl font-bold text-white mb-4">À propos du Framework AARRR</h3>
        <div className="grid md:grid-cols-2 gap-6 text-gray-300">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Origine</h4>
            <p className="text-sm">
              Créé par Dave McClure, le framework AARRR (aussi appelé "Pirate Metrics") 
              est devenu la référence en growth marketing pour optimiser la croissance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-400 mb-2">Avantages</h4>
            <p className="text-sm">
              Approche data-driven, identification des goulots d'étranglement, 
              optimisation continue et vision globale du parcours client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}